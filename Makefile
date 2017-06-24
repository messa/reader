run-dev:
	test -d node_modules || yarn install
	test -f local/reader.yaml
	READER_CONF=local/reader.yaml yarn run dev

run-mongodb:
	mkdir -p local/mongodb-data
	mongod -dbpath local/mongodb-data
