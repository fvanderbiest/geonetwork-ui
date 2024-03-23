/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Iso191153Converter } from './iso19115-3.converter'
import { parseXmlString, xmlToString } from '../xml-utils'
// @ts-ignore
import GENERIC_DATASET from '../fixtures/generic-dataset.iso19115-3.xml'
// @ts-ignore
import GENERIC_DATASET_PLUS_METAWAL_DATASET from '../fixtures/generic-dataset+metawal.iso19115-3.xml'
// @ts-ignore
import METAWAL_DATASET from '../fixtures/metawal.iso19115-3.dataset.xml'
// @ts-ignore
import METAWAL_SERVICE from '../fixtures/metawal.iso19115-3.service.xml'
import {
  METAWAL_DATASET_RECORD,
  METAWAL_SERVICE_RECORD,
} from '../fixtures/metawal.records'
import { GENERIC_DATASET_RECORD } from '../fixtures/generic.records'

// this makes the xml go through the same formatting as the converter
function formatXml(xmlString: string) {
  return xmlToString(parseXmlString(xmlString))
}

describe('ISO19115-3 converter', () => {
  let converter: Iso191153Converter

  beforeEach(() => {
    converter = new Iso191153Converter()
  })

  describe('from XML to model', () => {
    it('produces the corresponding record (metawal dataset)', async () => {
      const record = await converter.readRecord(METAWAL_DATASET)
      expect(record).toStrictEqual(METAWAL_DATASET_RECORD)
    })
    it('produces the corresponding record (metawal service)', async () => {
      const record = await converter.readRecord(METAWAL_SERVICE)
      expect(record).toStrictEqual(METAWAL_SERVICE_RECORD)
    })
    it('produces the corresponding record (generic dataset)', async () => {
      const record = await converter.readRecord(GENERIC_DATASET)
      expect(record).toStrictEqual(GENERIC_DATASET_RECORD)
    })
  })

  describe('from model to XML', () => {
    it('produces a valid XML document based on a generic record', async () => {
      // parse and output xml to guarantee identical formatting
      const ref = xmlToString(parseXmlString(GENERIC_DATASET))
      const xml = await converter.writeRecord(GENERIC_DATASET_RECORD)
      expect(xml).toStrictEqual(ref)
    })
    it('produces a valid XML document by combining a generic record and a third-party XML', async () => {
      // parse and output xml to guarantee identical formatting
      const ref = xmlToString(
        parseXmlString(GENERIC_DATASET_PLUS_METAWAL_DATASET)
      )
      const xml = await converter.writeRecord(
        GENERIC_DATASET_RECORD,
        METAWAL_DATASET
      )
      expect(xml).toStrictEqual(ref)
    })
  })

  describe('idempotency', () => {
    describe('with a third-party XML record', () => {
      describe('when converting to a native record and back to XML', () => {
        it('keeps the record unchanged (dataset)', async () => {
          const backAndForth = await converter.writeRecord(
            await converter.readRecord(METAWAL_DATASET),
            METAWAL_DATASET
          )
          expect(backAndForth).toStrictEqual(formatXml(METAWAL_DATASET))
        })
        it('keeps the record unchanged (service)', async () => {
          const backAndForth = await converter.writeRecord(
            await converter.readRecord(METAWAL_SERVICE),
            METAWAL_SERVICE
          )
          expect(backAndForth).toStrictEqual(formatXml(METAWAL_SERVICE))
        })
      })
    })
    describe('with a native record', () => {
      describe('when converting to XML and back', () => {
        it('keeps the record unchanged', async () => {
          const backAndForth = await converter.readRecord(
            await converter.writeRecord(GENERIC_DATASET_RECORD)
          )
          expect(backAndForth).toStrictEqual(GENERIC_DATASET_RECORD)
        })
      })
    })
  })
})
