#import <AppKit/AppKit.h>
#import <PDFKit/PDFKit.h>
#import <CoreText/CoreText.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSString *workDir = @"/Users/davitmovsisyan/Desktop/LingoPath";
        NSString *htmlPath = [workDir stringByAppendingPathComponent:@"scenario.html"];
        NSString *tempPdfPath = [workDir stringByAppendingPathComponent:@"temp_scenario.pdf"];
        NSString *finalPdfPath = [workDir stringByAppendingPathComponent:@"Avartakan_Handes_9_Scenar.pdf"];

        NSError *error = nil;
        NSString *htmlString = [NSString stringWithContentsOfFile:htmlPath encoding:NSUTF8StringEncoding error:&error];
        if (!htmlString) {
            NSLog(@"Failed to read HTML file: %@", error);
            return 1;
        }

        NSData *htmlData = [htmlString dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary *options = @{
            NSDocumentTypeDocumentAttribute: NSHTMLTextDocumentType,
            NSCharacterEncodingDocumentAttribute: @(NSUTF8StringEncoding)
        };
        NSAttributedString *attrStr = [[NSAttributedString alloc] initWithData:htmlData options:options documentAttributes:nil error:&error];
        if (!attrStr) {
            NSLog(@"Failed to parse HTML to NSAttributedString: %@", error);
            return 1;
        }

        // Setup print info for A4
        NSPrintInfo *printInfo = [[NSPrintInfo alloc] init];
        [printInfo setPaperSize:NSMakeSize(595.28, 841.89)]; // A4: 595.28 x 841.89 points
        [printInfo setTopMargin:48.0];
        [printInfo setBottomMargin:48.0];
        [printInfo setLeftMargin:45.0];
        [printInfo setRightMargin:45.0];
        [printInfo setHorizontalPagination:NSPrintingPaginationModeFit];
        [printInfo setVerticalPagination:NSPrintingPaginationModeAutomatic];
        [printInfo setJobDisposition:NSPrintSaveJob];

        [printInfo dictionary][NSPrintJobSavingURL] = [NSURL fileURLWithPath:tempPdfPath];

        CGFloat contentWidth = 595.28 - 90.0; // 505.28 pt
        NSTextView *textView = [[NSTextView alloc] initWithFrame:NSMakeRect(0, 0, contentWidth, 1000)];
        [[textView textStorage] setAttributedString:attrStr];
        [textView sizeToFit];

        NSPrintOperation *printOp = [NSPrintOperation printOperationWithView:textView printInfo:printInfo];
        [printOp setShowsPrintPanel:NO];
        [printOp setShowsProgressPanel:NO];
        BOOL success = [printOp runOperation];
        if (!success) {
            NSLog(@"Print operation failed.");
            return 1;
        }

        // Pass 2: Add Running Header and Running Footer with Page Numbers
        PDFDocument *doc = [[PDFDocument alloc] initWithURL:[NSURL fileURLWithPath:tempPdfPath]];
        if (!doc) {
            NSLog(@"Failed to open intermediate PDF for stamping");
            return 1;
        }

        NSUInteger pageCount = [doc pageCount];
        NSLog(@"Intermediate PDF generated with %lu pages.", (unsigned long)pageCount);

        CGRect pageRect = CGRectMake(0, 0, 595.28, 841.89);
        CGContextRef ctx = CGPDFContextCreateWithURL((__bridge CFURLRef)[NSURL fileURLWithPath:finalPdfPath], &pageRect, NULL);
        if (!ctx) {
            NSLog(@"Failed to create final PDF context");
            return 1;
        }

        for (NSUInteger i = 0; i < pageCount; i++) {
            PDFPage *page = [doc pageAtIndex:i];
            CGPDFPageRef pageRef = [page pageRef];

            CGPDFContextBeginPage(ctx, NULL);
            CGContextSaveGState(ctx);

            // Draw underlying page content
            CGContextDrawPDFPage(ctx, pageRef);

            // Running Header (pages 2+)
            if (i > 0) {
                // Subtle line
                CGContextSetStrokeColorWithColor(ctx, [NSColor colorWithCalibratedRed:0.75 green:0.82 blue:0.9 alpha:1.0].CGColor);
                CGContextSetLineWidth(ctx, 0.75);
                CGContextMoveToPoint(ctx, 45, 804);
                CGContextAddLineToPoint(ctx, 595.28 - 45, 804);
                CGContextStrokePath(ctx);

                // Header title
                NSDictionary *hAttr = @{
                    NSFontAttributeName: [NSFont fontWithName:@"HelveticaNeue-Bold" size:8.0],
                    NSForegroundColorAttributeName: [NSColor colorWithCalibratedRed:0.15 green:0.3 blue:0.55 alpha:1.0]
                };
                NSAttributedString *hStr = [[NSAttributedString alloc] initWithString:@"9-ՐԴ ԴԱՍԱՐԱՆԻ ԱՎԱՐՏԱԿԱՆ ՀԱՆԴԻՍՈՒԹՅՈՒՆ | 30:00 ՐՈՊԵ" attributes:hAttr];
                CTLineRef hLine = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)hStr);
                CGContextSetTextPosition(ctx, 45, 808);
                CTLineDraw(hLine, ctx);
                CFRelease(hLine);
            }

            // Running Footer (all pages)
            CGContextSetStrokeColorWithColor(ctx, [NSColor colorWithCalibratedRed:0.8 green:0.84 blue:0.88 alpha:1.0].CGColor);
            CGContextSetLineWidth(ctx, 0.75);
            CGContextMoveToPoint(ctx, 45, 36);
            CGContextAddLineToPoint(ctx, 595.28 - 45, 36);
            CGContextStrokePath(ctx);

            // Footer Left: Title
            NSDictionary *fLeftAttr = @{
                NSFontAttributeName: [NSFont fontWithName:@"HelveticaNeue-Italic" size:8.0],
                NSForegroundColorAttributeName: [NSColor colorWithCalibratedRed:0.4 green:0.45 blue:0.5 alpha:1.0]
            };
            NSAttributedString *fLeftStr = [[NSAttributedString alloc] initWithString:@"«Դպրոցական ճամփաներից դեպի մեծ կյանք» — Հանդիսավոր սցենար" attributes:fLeftAttr];
            CTLineRef fLeftLine = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)fLeftStr);
            CGContextSetTextPosition(ctx, 45, 24);
            CTLineDraw(fLeftLine, ctx);
            CFRelease(fLeftLine);

            // Footer Right: Page Number
            NSString *pageNumberStr = [NSString stringWithFormat:@"Էջ %lu / %lu", (unsigned long)(i + 1), (unsigned long)pageCount];
            NSDictionary *fRightAttr = @{
                NSFontAttributeName: [NSFont fontWithName:@"HelveticaNeue-Medium" size:8.0],
                NSForegroundColorAttributeName: [NSColor colorWithCalibratedRed:0.25 green:0.35 blue:0.5 alpha:1.0]
            };
            NSAttributedString *fRightStr = [[NSAttributedString alloc] initWithString:pageNumberStr attributes:fRightAttr];
            CTLineRef fRightLine = CTLineCreateWithAttributedString((__bridge CFAttributedStringRef)fRightStr);
            CGFloat w = CTLineGetTypographicBounds(fRightLine, NULL, NULL, NULL);
            CGContextSetTextPosition(ctx, 595.28 - 45 - w, 24);
            CTLineDraw(fRightLine, ctx);
            CFRelease(fRightLine);

            CGContextRestoreGState(ctx);
            CGPDFContextEndPage(ctx);
        }

        CGPDFContextClose(ctx);

        // Remove temp file
        [[NSFileManager defaultManager] removeItemAtPath:tempPdfPath error:nil];

        // Also create a copy in Russian for convenience
        NSString *ruCopyPath = [workDir stringByAppendingPathComponent:@"Сценарий_Выпускного_9_Класс.pdf"];
        [[NSFileManager defaultManager] copyItemAtPath:finalPdfPath toPath:ruCopyPath error:nil];

        NSLog(@"Final PDF successfully created at: %@", finalPdfPath);
        NSLog(@"Russian copy created at: %@", ruCopyPath);
    }
    return 0;
}
