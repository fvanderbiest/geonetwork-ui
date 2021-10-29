import { Location } from '@angular/common'
import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { map, tap } from 'rxjs/operators'

import * as RouterActions from './router.actions'
import * as SearchActions from '../../state/actions'
import { MdViewActions } from '@geonetwork-ui/feature/record'
import { navigation } from '@nrwl/angular'
import { MetadataRouteComponent, SearchRouteComponent } from '../constants'

@Injectable()
export class RouterEffects {
  constructor(
    private _actions$: Actions,
    private _router: Router,
    private _location: Location
  ) {}

  navigate$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(RouterActions.goAction),
        tap(({ path, query: queryParams }) => {
          this._router.navigate([path], { queryParams })
        })
      ),
    { dispatch: false }
  )

  /**
   * This effect will load the metadata when a navigation to
   * a metadata record happens
   */
  navigateToMetadata$ = createEffect(() =>
    this._actions$.pipe(
      navigation(MetadataRouteComponent, {
        run: (activatedRouteSnapshot: ActivatedRouteSnapshot) =>
          MdViewActions.loadFullMetadata({
            uuid: activatedRouteSnapshot.params.metadataUuid,
          }),
        onError(a: ActivatedRouteSnapshot, e) {
          console.error('Navigation failed', e)
        },
      })
    )
  )

  /**
   * This effect will close the metadata when a navigation to
   * the search results happens
   */
  navigateToSearch$ = createEffect(() =>
    this._actions$.pipe(
      navigation(SearchRouteComponent, {
        run: () => MdViewActions.close(),
      })
    )
  )

  /**
   * This effect will close the metadata when new search filters
   * are entered, thus triggering a new search
   */
  setSearchFilters$ = createEffect(() =>
    this._actions$.pipe(
      ofType(SearchActions.SET_FILTERS),
      map(() => MdViewActions.close())
    )
  )

  navigateBack$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(RouterActions.backAction),
        tap(() => this._location.back())
      ),
    { dispatch: false }
  )

  navigateForward$ = createEffect(
    () =>
      this._actions$.pipe(
        ofType(RouterActions.forwardAction),
        tap(() => this._location.forward())
      ),
    { dispatch: false }
  )
}
