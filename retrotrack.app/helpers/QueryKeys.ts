 

/**
 * Centralised query keys for @tanstack/react-query.
 * Every useQuery / useMutation in the app should reference these keys rather
 * than using raw string literals.
 */
export enum QueryKeys {
  // ── Calendar ──
  CalendarEvents = 'calendarEvents',
  CalendarEventTypes = 'calendarEventTypes',

  // ── Dashboard ──
  DashboardOverview = 'dashboardOverview',
  TodaysMood = 'todaysMood',

  // ── Tasks ──
  Tasks = 'tasks',
  TaskCategories = 'taskCategories',

  // ── Shopping ──
  ShoppingListItems = 'shoppingListItems',
  ShoppingListQuickAdd = 'shoppingListQuickAdd',

  // ── Finance / Pots ──
  PotOptions = 'potOptions',
  AllPotData = 'allPotData',
  UnprocessedTransactions = 'unprocessedTransactions',

  // ── Assets ──
  Assets = 'assets',
  AssetCategories = 'assetCategories',

  // ── Documents ──
  Documents = 'documents',
  DocumentCategories = 'documentCategories',

  // ── Meal Planner ──
  Recipes = 'recipes',
  MealPlan = 'mealPlan',
  RecipeDetail = 'recipeDetail',

  // ── RetroTrack Mobile ──
  MobileHomeData = 'mobileHomeData',
  TrackedGames = 'trackedGames',
  GameDetail = 'gameDetail',
}
