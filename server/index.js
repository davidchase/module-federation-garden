import Fastify from 'fastify'
import semver from 'semver'
import got from 'got'
import pkg from 'pg'
const { Client } = pkg

const database = process.env.PGDATABASE
const username = process.env.PGUSER
const password = process.env.PGPASSWORD

const string = `postgres://${username}:${password}@db/${database}`

async function dbConnection() {
	const client = new Client({
		connectionString: string
	})

	try {
		await client.connect()
	} catch (error) {
		throw new Error('Could not connect to database')
	}

	return {
		query: (text, params) => client.query(text, params)
	}
}

const fastify = Fastify({
	logger: true
})

function findMatchingVersion(semverRange, availableVersions) {
	if (!semver.validRange(semverRange)) {
		throw new Error('Invalid semver range')
	}

	const matchingVersions = availableVersions.filter(version =>
		semver.satisfies(version, semverRange)
	)

	return matchingVersions.length > 0
		? semver.maxSatisfying(matchingVersions, semverRange)
		: null
}

let version = ''

fastify.get('/:files', async function (request, reply) {
	reply.header('Access-Control-Allow-Origin', '*')
	reply.header('Content-Type', 'application/javascript; charset=utf-8')

	if (request.query.version === undefined) {
		return await got
			.get(
				`http://${process.env.VMBUCKET_URL}/public/${version}/${request.params.files}`
			)
			.text()
	}

	const versions = await got.get(`http://${process.env.VMBUCKET_URL}`).json()

	const match = findMatchingVersion(request.query.version, versions)

	version = match

	const data = await got
		.get(
			`http://${process.env.VMBUCKET_URL}/public/${version}/${request.params.files}`
		)
		.text()

	return data
})

fastify.get('/health', async (req, reply) => {
	return { status: 'ok' }
})

fastify.get('/get-data', async (req, reply) => {
	const { query } = await dbConnection()
	const { rows: country } = await query('SELECT * FROM country')
	return country
})

fastify.listen({ host: '0.0.0.0', port: 5002 }, err => {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
})
