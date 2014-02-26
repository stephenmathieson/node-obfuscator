
BINS = node_modules/.bin
SRC = index.js $(wildcard lib/*.js)
TESTS = $(wildcard test/*.js)
EXAMPLES = $(wildcard examples/*/*.js)
ACCEPTANCE = $(wildcard test/acceptance/*.js)

MOCHA_REPORTER ?= spec
JSCOVERAGE ?= jscoverage

all: lint test test-acceptance

test: node_modules
	@$(BINS)/mocha \
		-R $(MOCHA_REPORTER) \
		-r should

test-acceptance: examples/resolve/node_modules \
		examples/express/node_modules \
		$(ACCEPTANCE)
	@echo 'everything looks good'

examples/resolve/node_modules: examples/resolve/package.json
	@cd examples/resolve; npm install

examples/express/node_modules: examples/express/package.json
	@cd examples/express; npm install

$(ACCEPTANCE):
	node $@

test-cov: coverage.html
	@open coverage.html

coverage.html: node_modules lib-cov $(TESTS)
	@OBF_COV=1 \
		MOCHA_REPORTER=html-cov \
		$(MAKE) test > coverage.html

lib-cov: $(SRC)
	@rm -rf $@
	@$(JSCOVERAGE) lib $@

lint: node_modules
	@$(BINS)/jshint \
		--verbose \
		$(SRC) \
		$(TESTS) \
		$(ACCEPTANCE)

node_modules: package.json
	@npm install

clean:
	rm -rf examples/*/obfuscated.js
	rm -rf examples/*/node_modules
	rm -rf lib-cov coverage.html

.PHONY: test $(ACCEPTANCE) clean
