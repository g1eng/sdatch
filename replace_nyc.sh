#!/bin/sh -e
# attention: this script forces to replace nyc installation by c8 (dirty hack), especially for coverage reporting

nycdir=node_modules/nyc
[ -h "$nycdir" ] && {
	echo Your nyc seems to be already replaced.
	exit 1
}

{
	yarn install
	rm -rv $nycdir
	ln -sv c8 $nycdir
	ln -sv c8.js node_modules/nyc/bin/nyc.js
} || {
	echo error >&2
	exit 1
}
