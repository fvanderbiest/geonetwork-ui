import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { Observable } from 'rxjs'
import { EditorService } from '@geonetwork-ui/feature/editor'
import { CatalogRecord } from 'libs/common/domain/src/lib/model/record'

@Injectable({
  providedIn: 'root',
})
export class EditRecordResolver {
  constructor(private editorService: EditorService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CatalogRecord> {
    return this.editorService.loadRecordByUuid(route.paramMap.get('uuid'))
  }
}
