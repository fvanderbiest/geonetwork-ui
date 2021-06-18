import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GeoTableViewComponent } from './geo-table-view/geo-table-view.component'
import { UiLayoutModule } from '@geonetwork-ui/ui/layout'

@NgModule({
  imports: [CommonModule, UiLayoutModule],
  declarations: [GeoTableViewComponent],
  exports: [GeoTableViewComponent],
})
export class FeatureDatavizModule {}
