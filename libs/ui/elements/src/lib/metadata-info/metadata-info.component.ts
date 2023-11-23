import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { DatasetRecord } from 'libs/common/domain/src/lib/model/record'

@Component({
  selector: 'gn-ui-metadata-info',
  templateUrl: './metadata-info.component.html',
  styleUrls: ['./metadata-info.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataInfoComponent {
  @Input() metadata: Partial<DatasetRecord>
  @Input() incomplete: boolean
  @Output() keyword = new EventEmitter<string>()
  updatedTimes: number

  get hasUsage() {
    return (
      this.metadata.extras?.isOpenData === true ||
      this.metadata.useLimitations?.length ||
      this.metadata.accessConstraints?.length
    )
  }

  get usages(): string[] {
    let array = []
    if (this.metadata.useLimitations?.length) {
      array = array.concat(this.metadata.useLimitations)
    }
    if (this.metadata.accessConstraints?.length) {
      array = array.concat(this.metadata.accessConstraints.map((c) => c.text))
    }
    return array
  }

  get updateFrequency(): string {
    if (this.metadata.updateFrequency instanceof Object) {
      this.updatedTimes = this.metadata.updateFrequency.updatedTimes
      return `domain.record.updateFrequency.${this.metadata.updateFrequency.per}`
    } else if (typeof this.metadata.updateFrequency === 'string') {
      return `domain.record.updateFrequency.${this.metadata.updateFrequency}`
    } else {
      return undefined
    }
  }

  fieldReady(propName: string) {
    return !this.incomplete || propName in this.metadata
  }

  onKeywordClick(keyword: string) {
    this.keyword.emit(keyword)
  }
}
