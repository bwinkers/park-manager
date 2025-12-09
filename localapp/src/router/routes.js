const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/IndexPage.vue') },
      { path: '/spaces', name: 'spaces', component: () => import('pages/SpacesPage.vue') },
      { path: '/tenants', name: 'tenants', component: () => import('pages/TenantsPage.vue') },
      { path: '/leases', name: 'leases', component: () => import('pages/LeasesPage.vue') },
      { path: '/reservations', name: 'reservations', component: () => import('pages/ReservationsPage.vue') },
      { path: '/disaster-plan', name: 'disaster-plan', component: () => import('pages/DisasterPlanPage.vue') },
      { path: '/payments', name: 'payments', component: () => import('pages/PaymentsPage.vue') },
      { path: '/petty-cash', name: 'petty-cash', component: () => import('pages/PettyCashPage.vue') },
      { path: '/deposits', name: 'deposits', component: () => import('pages/DepositsPage.vue') },
      { path: '/reports', name: 'reports', component: () => import('pages/ReportsPage.vue') },
      { path: '/wait-list', name: 'wait-list', component: () => import('pages/WaitListPage.vue') },
      { path: '/meter-readings', name: 'meter-readings', component: () => import('pages/MeterReadingsPage.vue') },
      { path: '/electric-usage', name: 'electric-usage', component: () => import('pages/ElectricUsagePage.vue') },
      { path: '/maintenance-requests', name: 'maintenance-requests', component: () => import('pages/MaintenanceRequestsPage.vue') },
      { path: '/park-maps', name: 'park-maps', component: () => import('pages/ParkMapsPage.vue') },
      { path: '/rental-application', name: 'rental-application', component: () => import('src/pages/RentalApplicationPage.vue') },
      { path: '/rental-agreement', name: 'rental-agreement', component: () => import('src/pages/RentalAgreementPage.vue') },
      { path: '/walkthrough', name: 'walkthrough', component: () => import('pages/WalkthroughPage.vue') },
      { path: '/rental-rules', name: 'rental-rules', component: () => import('src/pages/RentalRulesPage.vue') },

    ],

  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
