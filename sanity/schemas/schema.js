// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

import schemaTypes from 'all:part:@sanity/base/schema-type';

import comment from './comment';
import tweet from './tweet';

export default createSchema({
	name: 'default',
	types: schemaTypes.concat([tweet, comment]),
});
