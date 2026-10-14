import { describe, expect, it } from 'vitest';
import {
  buildDailyLesson,
  generatePracticeLab,
  generateTodayPlan,
} from './learningData';

describe('learning plan generation', () => {
  it.each([10, 20, 30])('keeps the daily plan within %i selected minutes', (minutes) => {
    const plan = generateTodayPlan(minutes, 'A1', ['Vocabulary', 'Grammar'], ['Travel English']);
    expect(plan.minutes).toBe(minutes);
    expect(plan.tasks.reduce((sum, task) => sum + task.duration, 0)).toBe(minutes);
  });

  it('adapts the lesson to selected skills, goals, and daily time', () => {
    const lesson = buildDailyLesson(
      { level: 'B1', skills: ['Writing'], goals: ['Work English'], dailyGoalMinutes: 20 },
      3,
    );
    expect(lesson.focus).toBe('Writing');
    expect(lesson.title).toContain('Work English');
    expect(lesson.duration).toBe(20);
    expect(lesson.questionCount).toBe(6);
  });

  it.each([[10, 3], [20, 6], [30, 9]])(
    'generates %i-minute lesson with %i graded questions',
    (minutes, expectedQuestions) => {
      const lesson = buildDailyLesson({ level: 'A1', dailyGoalMinutes: minutes }, 1);
      expect(lesson.questions).toHaveLength(expectedQuestions);
    },
  );

  it('generates different question sets on different lesson days', () => {
    const firstDay = buildDailyLesson({ level: 'A2', dailyGoalMinutes: 20 }, 1);
    const secondDay = buildDailyLesson({ level: 'A2', dailyGoalMinutes: 20 }, 2);
    expect(firstDay.questions.map((question) => question.prompt))
      .not.toEqual(secondDay.questions.map((question) => question.prompt));
  });

  it('increases task difficulty with level and rotates skill content', () => {
    const beginnerTasks = generatePracticeLab('A1', 20, ['Vocabulary'], ['Travel English']);
    const advancedTasks = generatePracticeLab('C1', 20, ['Vocabulary'], ['Travel English']);
    expect(advancedTasks[0].difficulty).not.toBe('Warm-up');
    expect(advancedTasks[0].difficulty).not.toBe(beginnerTasks[0].difficulty);
    expect(advancedTasks.every((task) => task.skill === 'Vocabulary')).toBe(true);
  });

  it('creates more practice tasks when the user selects more study time', () => {
    const shortSession = generatePracticeLab('A1', 10);
    const longSession = generatePracticeLab('A1', 30);
    expect(longSession.length).toBeGreaterThan(shortSession.length);
  });
});
