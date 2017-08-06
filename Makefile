run-dev: node_modules
	READER_CONF=local/reader-conf.yaml yarn run dev

node_modules:
	yarn install
