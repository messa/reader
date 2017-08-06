run-dev: node_modules
	READER_CONF=local/reader-conf.yaml yarn run dev

node_modules:
	yarn install

clean:
	rm -rf .next node_modules yarn-error.log
