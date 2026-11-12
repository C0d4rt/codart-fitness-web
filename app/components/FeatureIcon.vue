<script setup lang="ts">
const props = defineProps<{ feature: string }>()

const SHAPES = {
  chat: 'M4.5 6.5A2.5 2.5 0 0 1 7 4h10a2.5 2.5 0 0 1 2.5 2.5v7A2.5 2.5 0 0 1 17 16h-6l-4.5 3.5V16a2 2 0 0 1-2-2z',
  clock: 'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zM12 7.5V12l3 2',
  barcode: 'M4.5 6v12M7.5 6v12M11 6v12M13.5 6v12M17 6v12M19.5 6v12',
  bolt: 'M13 3.5 5.5 13.5H12l-1 7 7.5-10H12z',
  bell: 'M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14zM10 20.5h4',
  camera:
    'M2.75 9A2.75 2.75 0 0 1 5.5 6.25h1.9c.5 0 .95-.28 1.18-.72l.6-1.16c.23-.44.68-.72 1.18-.72h3.28c.5 0 .95.28 1.18.72l.6 1.16c.23.44.68.72 1.18.72h1.9A2.75 2.75 0 0 1 21.25 9v8.25A2.75 2.75 0 0 1 18.5 20h-13a2.75 2.75 0 0 1-2.75-2.75zM12 9a3.75 3.75 0 1 1 0 7.5A3.75 3.75 0 0 1 12 9z',
  book: 'M5 17V7a2.5 2.5 0 0 1 2.5-2.5H18v12H7.5A2.5 2.5 0 0 0 5 19a1.5 1.5 0 0 0 1.5 1.5H18',
  home: 'M4.5 10.5 12 4.5l7.5 6V19a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1zM9.75 20v-5h4.5v5',
  dumbbell: 'M3.5 9.5v5M6.5 7v10M17.5 7v10M20.5 9.5v5M6.5 12h11',
  target:
    'M12 3.5a8.5 8.5 0 1 1 0 17 8.5 8.5 0 0 1 0-17zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM12 11.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z',
  plate: 'M7 3.5v6a2 2 0 0 0 4 0v-6M9 11.5v9M16.5 20.5v-17c-2 1-3 3.5-3 7.5h3',
  hourglass:
    'M7 3.5h10M7 20.5h10M8 3.5c0 4.5 8 4.5 8 8.5s-8 4-8 8.5M16 3.5c0 4.5-8 4.5-8 8.5s8 4 8 8.5',
  cart: 'M3.5 4.5h2l2.2 10.5h9.8l2-7.5H6.4M9 19.5h.01M16.5 19.5h.01',
  chart: 'M5 19.5v-5M10 19.5V9M15 19.5v-8M20 19.5V5',
  trend: 'M3.5 16.5l5-5 4 3.5 8-8M15 7h5.5v5.5',
  leaf: 'M5.5 18.5c0-8 5-13 14-13 0 9-5 14-13 14zM5.5 18.5l6.5-6.5',
  file: 'M7 3.5h7l4.5 4.5v12.5H7zM14 3.5V8h4.5M9.5 13h6M9.5 16.5h6',
  clipboard: 'M8.5 5h-2v15.5h11V5h-2M9 3.5h6v3H9zM9.5 11h5M9.5 15h5',
  swap: 'M5 8.5h13l-3.5-3.5M19 15.5H6l3.5 3.5',
  person: 'M12 5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM5 20c.8-4 3.6-6 7-6s6.2 2 7 6',
  calendar:
    'M6.5 5.5h11A2.5 2.5 0 0 1 20 8v9.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5V8a2.5 2.5 0 0 1 2.5-2.5zM4 10h16M8.5 3.5v4M15.5 3.5v4',
  infinity:
    'M12 12c-2-2.5-3.5-4-5.5-4a4 4 0 0 0 0 8c2 0 3.5-1.5 5.5-4s3.5-4 5.5-4a4 4 0 0 1 0 8c-2 0-3.5-1.5-5.5-4z',
}

type Shape = keyof typeof SHAPES

const FEATURE_SHAPE: Record<string, Shape> = {
  diary: 'chat',
  namedMeals: 'clock',
  barcode: 'barcode',
  quickAdd: 'bolt',
  reminders: 'bell',
  photos: 'camera',
  quickAddMacros: 'bolt',
  backfill: 'calendar',
  mealReminders: 'bell',
  myFoods: 'book',
  savedMeals: 'book',
  recipes: 'book',
  pantry: 'home',
  workouts: 'dumbbell',
  savedWorkouts: 'dumbbell',
  dayGoal: 'target',
  goalPercent: 'target',
  mealGoals: 'target',
  goalGrams: 'target',
  weekdayGoals: 'calendar',
  mealSuggestion: 'plate',
  fasting: 'hourglass',
  compareProducts: 'cart',
  weekSummary: 'chart',
  weight: 'trend',
  nutrients: 'leaf',
  foodRanking: 'chart',
  csvExport: 'file',
  anamnesis: 'clipboard',
  swapDiet: 'swap',
  periodizedTraining: 'dumbbell',
  professionalReview: 'person',
  checkIns: 'calendar',
  coachChat: 'chat',
  unlimitedReplies: 'infinity',
}

const path = computed(() => SHAPES[FEATURE_SHAPE[props.feature] ?? 'chat'])
</script>

<template>
  <svg class="feature-icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="path" /></svg>
</template>

<style scoped>
.feature-icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
