import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'

import Layout from 'layouts'

const routes = [
  {
    path: '/public/jobs',
    Component: lazy(() => import('pages/job')),
    exact: true,
  },
  // Thông tin chi tiết việc làm
  {
    path: '/public/job-detail/:id',
    Component: lazy(() => import('pages/job-detail')),
    exact: true,
  },
  {
    path: '/public/companies',
    Component: lazy(() => import('pages/company')),
    exact: true,
  },
  // Thông tin chi tiết công ty
  {
    path: '/public/company-detail/:id',
    Component: lazy(() => import('pages/company-detail')),
    exact: true,
  },
  {
    path: '/room/:roomId',
    Component: lazy(() => import('pages/room')),
    exact: true,
  },
  {
    path: '/recruitment',
    Component: lazy(() => import('pages/recruitment')),
    exact: true,
  },
  {
    path: '/job-category-management',
    Component: lazy(() => import('pages/management/job-category-management')),
    exact: true,
  },
  {
    path: '/job-field-management',
    Component: lazy(() => import('pages/management/job-field-management')),
    exact: true,
  },
  {
    path: '/company-management',
    Component: lazy(() => import('pages/management/company-management')),
    exact: true,
  },
  {
    path: '/user-management',
    Component: lazy(() => import('pages/management/user-management')),
    exact: true,
  },
  {
    path: '/cv',
    Component: lazy(() => import('pages/cv')),
    exact: true,
  },
  {
    path: '/applied-job',
    Component: lazy(() => import('pages/applied-job')),
    exact: true,
  },

  {
    path: '/change-password',
    Component: lazy(() => import('pages/change-password')),
    exact: true,
  },

  {
    path: '/personal-information',
    Component: lazy(() => import('pages/personal-information')),
    exact: true,
  },
  {
    path: '/company-information',
    Component: lazy(() => import('pages/company-information')),
    exact: true,
  },

  // Auth Pages
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/auth/forgot-password',
    Component: lazy(() => import('pages/auth/forgot-password')),
    exact: true,
  },
  {
    path: '/auth/reset-password',
    Component: lazy(() => import('pages/auth/reset-password/ResetPassword')),
    exact: true,
  },
  {
    path: '/auth/verify-account',
    Component: lazy(() => import('pages/auth/verify-account')),
    exact: true,
  },

  {
    path: '/auth/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
  },
  {
    path: '/auth/lockscreen',
    Component: lazy(() => import('pages/auth/lockscreen')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  return (
    <ConnectedRouter history={history}>
      <Layout>
        <Route
          render={(state) => {
            const { location } = state
            return (
              <SwitchTransition>
                <CSSTransition
                  key={location.pathname}
                  appear
                  classNames={routerAnimation}
                  timeout={routerAnimation === 'none' ? 0 : 300}
                >
                  <Switch location={location}>
                    <Route exact path="/" render={() => <Redirect to="/public/jobs" />} />
                    {routes.map(({ path, Component, exact }) => (
                      <Route
                        path={path}
                        key={path}
                        exact={exact}
                        render={() => {
                          return (
                            <div className={routerAnimation}>
                              <Suspense fallback={null}>
                                <Component />
                              </Suspense>
                            </div>
                          )
                        }}
                      />
                    ))}
                    <Redirect to="/auth/404" />
                  </Switch>
                </CSSTransition>
              </SwitchTransition>
            )
          }}
        />
      </Layout>
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
