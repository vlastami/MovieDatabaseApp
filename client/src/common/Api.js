async function  sendApiRequest(request, options) {
	return await fetch(request, options).then((response) => {
		if (response.status!= 200) {
			throw   response.json();
		}
		return response.json();
	});
}

function createRequestOptions(method = 'get', body = {}) {
	let options = { method: method };

	if (['post', 'put'].includes(options.method)) {
		options['headers'] = { 'Content-Type': 'application/json' };
		options['body'] = JSON.stringify(body);
	}

	return options;
}

function hasParam(request, key, value) {
	if (value != null && value !== '') {
		request.searchParams.append(key, value);
	}
}

export const Api = (url, params = {}, options) => {
	let request = new URL(url, 'http://localhost:5000');

	Object.keys(params).forEach((key) => hasParam(request, key, params[key]));

	return sendApiRequest(request, options);
};

export const ApiGet = (url, params = {}) => {
	return Api(url, params, createRequestOptions('get'));
};

export const ApiPost = (url, body) => {
	return Api(url, {}, createRequestOptions('post', body));
};

export const ApiPut = (url, body = {}) => {
	return Api(url, {}, createRequestOptions('put', body));
};

export const ApiDelete = (url) => {
	return Api(url, {}, createRequestOptions('delete'));
};

export default Api;
