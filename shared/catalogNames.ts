import type { Locale } from './locale'

export type CatalogNames = {
  plans: Record<'premium' | 'coaching', string>
  groups: Record<string, string>
  features: Record<string, string>
}

/**
 * `GET /fitness/plans` names plans, groups and features in Portuguese; other languages take
 * the app's own wording for the same ids (`fitness.plan.*` and `fitness.plans.*` in its locales).
 * Portuguese is named here too, because the names the API still serves promise professionals
 * that Premium Pro does not have.
 */
export const CATALOG_NAMES: Partial<Record<Locale, CatalogNames>> = {
  pt: {
    plans: { premium: 'Premium', coaching: 'Premium Pro' },
    groups: {
      log: 'Registrar',
      library: 'Sua biblioteca',
      workout: 'Treino',
      goals: 'Metas',
      reports: 'Relatórios',
      coaching: 'Premium Pro',
    },
    features: {
      diary: 'Diário por texto e áudio',
      namedMeals: 'Refeições do dia com nome',
      barcode: 'Código de barras digitado',
      quickAdd: 'Registro rápido de calorias',
      reminders: 'Lembrete para anotar',
      photos: 'Foto do prato e do rótulo',
      quickAddMacros: 'Registro rápido com macros',
      backfill: 'Registrar até 7 dias atrás',
      mealReminders: 'Lembrete por refeição',
      myFoods: 'Meus alimentos',
      savedMeals: 'Refeições salvas',
      recipes: 'Receitas, também por link',
      pantry: 'Despensa',
      workouts: 'Treino com gasto calórico',
      savedWorkouts: 'Treinos salvos',
      readyPrograms: 'Treinos prontos',
      dayGoal: 'Meta do dia e quanto falta',
      goalPercent: 'Macros da meta em %',
      mealGoals: 'Meta por refeição',
      goalGrams: 'Macros da meta em gramas',
      weekdayGoals: 'Meta por dia da semana',
      mealSuggestion: 'Sugestão do que comer',
      fasting: 'Jejum intermitente',
      compareProducts: 'Comparar no mercado',
      weekSummary: 'Resumo da semana',
      weight: 'Peso e evolução',
      nutrients: 'Nutrientes além dos macros',
      foodRanking: 'Alimentos que mais pesaram',
      csvExport: 'Planilha do diário (CSV)',
      anamnesis: 'Anamnese completa',
      swapDiet: 'Dieta por trocas montada para você',
      periodizedTraining: 'Treino periodizado',
      professionalReview: 'Plano ajustado à sua evolução',
      checkIns: 'Check-ins e reavaliação mensal',
      coachChat: 'Dúvidas respondidas pela nossa equipe em até 24 h',
      unlimitedReplies: 'Sem limite de respostas',
    },
  },
  en: {
    plans: { premium: 'Premium', coaching: 'Premium Pro' },
    groups: {
      log: 'Logging',
      library: 'Your library',
      workout: 'Workouts',
      goals: 'Goals',
      reports: 'Reports',
      coaching: 'Premium Pro',
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
      mealReminders: 'Reminder per meal',
      myFoods: 'My foods',
      savedMeals: 'Saved meals',
      recipes: 'Recipes, also by link',
      pantry: 'Pantry',
      workouts: 'Workouts with calories burned',
      savedWorkouts: 'Saved workouts',
      readyPrograms: 'Ready workout programs',
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
      anamnesis: 'Full intake assessment',
      swapDiet: 'Exchange-based diet built for you',
      periodizedTraining: 'Periodized training',
      professionalReview: 'Plan adjusted to your progress',
      checkIns: 'Check-ins and monthly reassessment',
      coachChat: 'Questions answered by our team within 24 h',
      unlimitedReplies: 'No reply limit',
    },
  },
}
