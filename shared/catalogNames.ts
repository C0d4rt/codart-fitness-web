import type { Locale } from './locale'

export type CatalogNames = {
  plans: Record<'basic' | 'premium', string>
  groups: Record<string, string>
  features: Record<string, string>
}

/**
 * `GET /fitness/plans` names plans, groups and features in Portuguese; other languages take
 * the app's own wording for the same ids (`fitness.plan.*` and `fitness.plans.*` in its locales).
 */
export const CATALOG_NAMES: Partial<Record<Locale, CatalogNames>> = {
  en: {
    plans: { premium: 'Premium', basic: 'Basic' },
    groups: {
      log: 'Logging',
      library: 'Your library',
      workout: 'Workouts',
      goals: 'Goals',
      reports: 'Reports',
    },
    features: {
      diary: 'Diary by text and voice',
      namedMeals: 'Named meals of the day',
      barcode: 'Typed barcode',
      quickAdd: 'Quick calorie add',
      reminders: 'Logging reminder',
      photos: 'Photo of the plate and the label',
      quickAddMacros: 'Quick add with macros',
      backfill: 'Logging up to 7 days back',
      myFoods: 'My foods',
      savedMeals: 'Saved meals',
      recipes: 'Recipes, also by link',
      pantry: 'Pantry',
      workouts: 'Workouts with calories burned',
      savedWorkouts: 'Saved workouts',
      dayGoal: 'Daily goal and how much is left',
      goalPercent: 'Goal macros in %',
      mealGoals: 'Goal per meal',
      goalGrams: 'Goal macros in grams',
      weekdayGoals: 'Goal per weekday',
      mealSuggestion: 'Suggestions of what to eat',
      fasting: 'Intermittent fasting',
      compareProducts: 'Comparing at the store',
      weekSummary: 'Week summary',
      weight: 'Weight and progress',
      nutrients: 'Nutrients beyond macros',
      foodRanking: 'Foods that weighed most',
      csvExport: 'Diary spreadsheet (CSV)',
    },
  },
}
