#!/usr/bin/env bash

DIST_DEMO_PATH=dist/demo/
DIST_WC_PATH=${DIST_DEMO_PATH}webcomponents/

echo '-- Build Geonetwork Web Components'
nx run webcomponents:build --output-hashing=none --skip-nx-cache --output-path=${DIST_WC_PATH}

echo '-- Publish html page for Web Component'
mkdir -p $DIST_WC_PATH
cat ${DIST_WC_PATH}{runtime,polyfills,main}.js > $DIST_WC_PATH'gn-wc.js'
rm -f ${DIST_WC_PATH}main.js
rm -f ${DIST_WC_PATH}polyfills.js
rm -f ${DIST_WC_PATH}runtime.js
rm -f ${DIST_WC_PATH}styles.css

for c in apps/webcomponents/src/app/components/gn-* ; do
  echo "-- Copy HTML sample for:" `basename $c`
  cp $c/*".sample.html" $DIST_WC_PATH
done

echo "-- Copy demo pages"
mkdir -p ${DIST_DEMO_PATH}
cp -R demo/* ${DIST_DEMO_PATH}


if [ ${1} ] && [ ${1} = "--serve" ]
then
  ./node_modules/.bin/http-server $DIST_DEMO_PATH -p 8001 --gzip
fi
