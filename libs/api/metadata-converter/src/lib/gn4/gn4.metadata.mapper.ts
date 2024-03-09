import { Gn4FieldMapper } from './gn4.field.mapper'
import { lastValueFrom } from 'rxjs'
import { OrganizationsServiceInterface } from '@geonetwork-ui/common/domain/organizations.service.interface'
import { CatalogRecord } from '@geonetwork-ui/common/domain/model/record'
import { MetadataBaseMapper } from '../metadata-base.mapper'
import { Injectable } from '@angular/core'
import { Gn4Record } from './types'

@Injectable({
  providedIn: 'root',
})
export class Gn4MetadataMapper extends MetadataBaseMapper<Gn4Record> {
  constructor(
    private fieldMapper: Gn4FieldMapper,
    private orgsService: OrganizationsServiceInterface
  ) {
    super()
  }

  readRecord(document: Gn4Record): Promise<CatalogRecord> {
    const { _source } = document
    const emptyRecord: Partial<CatalogRecord> = {
      kind: 'dataset',
      status: null,
      lineage: null,
      recordUpdated: null,
      ownerOrganization: null,
      licenses: [],
      legalConstraints: [],
      securityConstraints: [],
      otherConstraints: [],
      contacts: [],
      contactsForResource: [],
      keywords: [],
      themes: [],
      spatialExtents: [],
      temporalExtents: [],
      overviews: [],
    }
    const record: CatalogRecord = Object.keys(_source).reduce(
      (prev, fieldName) =>
        this.fieldMapper.getMappingFn(fieldName)(prev, _source),
      emptyRecord
    )
    return lastValueFrom(
      this.orgsService.addOrganizationToRecordFromSource(_source, record)
    )
  }

  writeRecord(record: CatalogRecord): Promise<Gn4Record> {
    throw new Error('not implemented')
  }
}
