define({ "api": [
  {
    "type": "delete",
    "url": "/services/:id",
    "title": "Delete Existing Service",
    "version": "1.0.0",
    "name": "DeleteService",
    "group": "Service",
    "description": "<p>Delete existing service</p>",
    "filename": "lib/http.router.js",
    "groupTitle": "",
    "sampleRequest": [
      {
        "url": "https://majifix-service.herokuapp.com/v1/services/:id"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept",
            "defaultValue": "application/json",
            "description": "<p>Accepted content type</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept-Encoding",
            "defaultValue": "gzip, deflate",
            "description": "<p>Accepted encoding type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Accept\": \"application/json\"\n  \"Authorization\": \"Bearer ey6utFreRdy5\"\n  \"Accept-Encoding\": \"gzip, deflate\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Unique service identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "jurisdiction",
            "defaultValue": "undefined",
            "description": "<p>jurisdiction under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "group",
            "defaultValue": "undefined",
            "description": "<p>service group under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "priority",
            "defaultValue": "undefined",
            "description": "<p>A default priority of the service. It assigned to service request if no priority set.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>A unique identifier of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name.en",
            "description": "<p>A unique human readable name of the service (request type) e.g Water Leakage.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "description",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description.en",
            "description": "<p>A detailed human readable explanation about the service(request type).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "color",
            "description": "<p>A color code(in hexadecimal format) eg. #363636 used to differentiate a service visually from other service.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Date when service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Date when service was last updated</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"_id\": \"5aefff461e0a5527eb1955bd\",\n   \"jurisdiction\": {\n     \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n     \"code\": \"66514685\",\n     \"name\": \"Gana\"\n   },\n   \"group\": {\n     \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n     \"code\": \"4685\",\n     \"name\": \"Gana\"\n   },\n   \"code\": \"05817253\",\n   \"name\": {\n     \"en\": \"Rowe\"\n   },\n   \"description\": {\n     \"en\": \"Eos aut non non delectus dolor eos\".\n   },\n   \"color\": \"#8ced78\",\n   \"createdAt\": \"2018-05-07T07:24:54.490Z\",\n   \"updatedAt\": \"2018-05-07T07:24:54.490Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "JWTExpired",
            "description": "<p>Authorization token has expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AuthorizationHeaderRequired",
            "description": "<p>Authorization header is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"jwt expired\",\n  \"error\":{}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"Authorization header required\",\n  \"error\":{}\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/jurisdictions/:jurisdiction/services",
    "title": "List Jurisdiction Services",
    "version": "1.0.0",
    "name": "GetJurisdictionServices",
    "group": "Service",
    "description": "<p>Returns a list of services of specified jurisdiction</p>",
    "filename": "lib/http.router.js",
    "groupTitle": "",
    "sampleRequest": [
      {
        "url": "https://majifix-service.herokuapp.com/v1/jurisdictions/:jurisdiction/services"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept",
            "defaultValue": "application/json",
            "description": "<p>Accepted content type</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept-Encoding",
            "defaultValue": "gzip, deflate",
            "description": "<p>Accepted encoding type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Accept\": \"application/json\"\n  \"Authorization\": \"Bearer ey6utFreRdy5\"\n  \"Accept-Encoding\": \"gzip, deflate\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>List of services</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data._id",
            "description": "<p>Unique service identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "data.jurisdiction",
            "defaultValue": "undefined",
            "description": "<p>jurisdiction under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "data.group",
            "defaultValue": "undefined",
            "description": "<p>service group under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "data.priority",
            "defaultValue": "undefined",
            "description": "<p>A default priority of the service. It assigned to service request if no priority set.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.code",
            "description": "<p>A unique identifier of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.name.en",
            "description": "<p>A unique human readable name of the service (request type) e.g Water Leakage.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.description",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.description.en",
            "description": "<p>A detailed human readable explanation about the service(request type).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.color",
            "description": "<p>A color code(in hexadecimal format) eg. #363636 used to differentiate a service visually from other service.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.createdAt",
            "description": "<p>Date when service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.updatedAt",
            "description": "<p>Date when service was last updated</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "total",
            "description": "<p>Total number of service</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "size",
            "description": "<p>Number of service returned</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Query limit used</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>Query skip/offset used</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Page number</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "pages",
            "description": "<p>Total number of pages</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "lastModified",
            "description": "<p>Date and time at which latest service was last modified</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"data\": [\n    {\n      \"_id\": \"5aefff461e0a5527eb1955bd\",\n      \"jurisdiction\": {\n        \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n        \"code\": \"66514685\",\n        \"name\": \"Gana\"\n      },\n      \"code\": \"05817253\",\n      \"name\": {\n        \"en\": \"Rowe\"\n      },\n      \"description\": {\n        \"en\": \"Eos aut non non delectus dolor eos\".\n      },\n      \"color\": \"#8ced78\",\n      \"createdAt\": \"2018-05-07T07:24:54.490Z\",\n      \"updatedAt\": \"2018-05-07T07:24:54.490Z\"\n   }\n  ],\n  \"total\": 20,\n  \"size\": 10,\n  \"limit\": 10,\n  \"skip\": 0,\n  \"page\": 1,\n  \"pages\": 2,\n  \"lastModified\": \"2018-05-07T07:22:43.771Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "JWTExpired",
            "description": "<p>Authorization token has expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AuthorizationHeaderRequired",
            "description": "<p>Authorization header is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"jwt expired\",\n  \"error\":{}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"Authorization header required\",\n  \"error\":{}\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/open311/services",
    "title": "List Services",
    "version": "1.0.0",
    "name": "GetOpen311Services",
    "group": "Service",
    "description": "<p>Returns a list of services in open311 format</p>",
    "filename": "lib/http.router.js",
    "groupTitle": "",
    "sampleRequest": [
      {
        "url": "https://majifix-service.herokuapp.com/v1/open311/services"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept",
            "defaultValue": "application/json",
            "description": "<p>Accepted content type</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept-Encoding",
            "defaultValue": "gzip, deflate",
            "description": "<p>Accepted encoding type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Accept\": \"application/json\"\n  \"Authorization\": \"Bearer ey6utFreRdy5\"\n  \"Accept-Encoding\": \"gzip, deflate\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>List of services</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data._id",
            "description": "<p>Unique service identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "data.jurisdiction",
            "defaultValue": "undefined",
            "description": "<p>jurisdiction under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "data.group",
            "defaultValue": "undefined",
            "description": "<p>service group under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "data.priority",
            "defaultValue": "undefined",
            "description": "<p>A default priority of the service. It assigned to service request if no priority set.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.code",
            "description": "<p>A unique identifier of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.name.en",
            "description": "<p>A unique human readable name of the service (request type) e.g Water Leakage.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.description",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.description.en",
            "description": "<p>A detailed human readable explanation about the service(request type).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.color",
            "description": "<p>A color code(in hexadecimal format) eg. #363636 used to differentiate a service visually from other service.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.createdAt",
            "description": "<p>Date when service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.updatedAt",
            "description": "<p>Date when service was last updated</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "total",
            "description": "<p>Total number of service</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "size",
            "description": "<p>Number of service returned</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Query limit used</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>Query skip/offset used</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Page number</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "pages",
            "description": "<p>Total number of pages</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "lastModified",
            "description": "<p>Date and time at which latest service was last modified</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"data\": [\n    {\n      \"_id\": \"5aefff461e0a5527eb1955bd\",\n      \"jurisdiction\": {\n        \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n        \"code\": \"66514685\",\n        \"name\": \"Gana\"\n      },\n      \"code\": \"05817253\",\n      \"name\": {\n        \"en\": \"Rowe\"\n      },\n      \"description\": {\n        \"en\": \"Eos aut non non delectus dolor eos\".\n      },\n      \"color\": \"#8ced78\",\n      \"createdAt\": \"2018-05-07T07:24:54.490Z\",\n      \"updatedAt\": \"2018-05-07T07:24:54.490Z\"\n   }\n  ],\n  \"total\": 20,\n  \"size\": 10,\n  \"limit\": 10,\n  \"skip\": 0,\n  \"page\": 1,\n  \"pages\": 2,\n  \"lastModified\": \"2018-05-07T07:22:43.771Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "JWTExpired",
            "description": "<p>Authorization token has expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AuthorizationHeaderRequired",
            "description": "<p>Authorization header is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"jwt expired\",\n  \"error\":{}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"Authorization header required\",\n  \"error\":{}\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/services/:id",
    "title": "Get Existing Service",
    "version": "1.0.0",
    "name": "GetService",
    "group": "Service",
    "description": "<p>Get existing service</p>",
    "filename": "lib/http.router.js",
    "groupTitle": "",
    "sampleRequest": [
      {
        "url": "https://majifix-service.herokuapp.com/v1/services/:id"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept",
            "defaultValue": "application/json",
            "description": "<p>Accepted content type</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept-Encoding",
            "defaultValue": "gzip, deflate",
            "description": "<p>Accepted encoding type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Accept\": \"application/json\"\n  \"Authorization\": \"Bearer ey6utFreRdy5\"\n  \"Accept-Encoding\": \"gzip, deflate\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Unique service identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "jurisdiction",
            "defaultValue": "undefined",
            "description": "<p>jurisdiction under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "group",
            "defaultValue": "undefined",
            "description": "<p>service group under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "priority",
            "defaultValue": "undefined",
            "description": "<p>A default priority of the service. It assigned to service request if no priority set.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>A unique identifier of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name.en",
            "description": "<p>A unique human readable name of the service (request type) e.g Water Leakage.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "description",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description.en",
            "description": "<p>A detailed human readable explanation about the service(request type).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "color",
            "description": "<p>A color code(in hexadecimal format) eg. #363636 used to differentiate a service visually from other service.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Date when service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Date when service was last updated</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"_id\": \"5aefff461e0a5527eb1955bd\",\n   \"jurisdiction\": {\n     \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n     \"code\": \"66514685\",\n     \"name\": \"Gana\"\n   },\n   \"group\": {\n     \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n     \"code\": \"4685\",\n     \"name\": \"Gana\"\n   },\n   \"code\": \"05817253\",\n   \"name\": {\n     \"en\": \"Rowe\"\n   },\n   \"description\": {\n     \"en\": \"Eos aut non non delectus dolor eos\".\n   },\n   \"color\": \"#8ced78\",\n   \"createdAt\": \"2018-05-07T07:24:54.490Z\",\n   \"updatedAt\": \"2018-05-07T07:24:54.490Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "JWTExpired",
            "description": "<p>Authorization token has expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AuthorizationHeaderRequired",
            "description": "<p>Authorization header is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"jwt expired\",\n  \"error\":{}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"Authorization header required\",\n  \"error\":{}\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "get",
    "url": "/services",
    "title": "List Services",
    "version": "1.0.0",
    "name": "GetServices",
    "group": "Service",
    "description": "<p>Returns a list of services</p>",
    "filename": "lib/http.router.js",
    "groupTitle": "",
    "sampleRequest": [
      {
        "url": "https://majifix-service.herokuapp.com/v1/services"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept",
            "defaultValue": "application/json",
            "description": "<p>Accepted content type</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept-Encoding",
            "defaultValue": "gzip, deflate",
            "description": "<p>Accepted encoding type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Accept\": \"application/json\"\n  \"Authorization\": \"Bearer ey6utFreRdy5\"\n  \"Accept-Encoding\": \"gzip, deflate\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>List of services</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data._id",
            "description": "<p>Unique service identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "data.jurisdiction",
            "defaultValue": "undefined",
            "description": "<p>jurisdiction under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "data.group",
            "defaultValue": "undefined",
            "description": "<p>service group under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "data.priority",
            "defaultValue": "undefined",
            "description": "<p>A default priority of the service. It assigned to service request if no priority set.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.code",
            "description": "<p>A unique identifier of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.name.en",
            "description": "<p>A unique human readable name of the service (request type) e.g Water Leakage.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.description",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.description.en",
            "description": "<p>A detailed human readable explanation about the service(request type).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.color",
            "description": "<p>A color code(in hexadecimal format) eg. #363636 used to differentiate a service visually from other service.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.createdAt",
            "description": "<p>Date when service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "data.updatedAt",
            "description": "<p>Date when service was last updated</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "total",
            "description": "<p>Total number of service</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "size",
            "description": "<p>Number of service returned</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Query limit used</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "skip",
            "description": "<p>Query skip/offset used</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "page",
            "description": "<p>Page number</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "pages",
            "description": "<p>Total number of pages</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "lastModified",
            "description": "<p>Date and time at which latest service was last modified</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"data\": [\n    {\n      \"_id\": \"5aefff461e0a5527eb1955bd\",\n      \"jurisdiction\": {\n        \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n        \"code\": \"66514685\",\n        \"name\": \"Gana\"\n      },\n      \"code\": \"05817253\",\n      \"name\": {\n        \"en\": \"Rowe\"\n      },\n      \"description\": {\n        \"en\": \"Eos aut non non delectus dolor eos\".\n      },\n      \"color\": \"#8ced78\",\n      \"createdAt\": \"2018-05-07T07:24:54.490Z\",\n      \"updatedAt\": \"2018-05-07T07:24:54.490Z\"\n   }\n  ],\n  \"total\": 20,\n  \"size\": 10,\n  \"limit\": 10,\n  \"skip\": 0,\n  \"page\": 1,\n  \"pages\": 2,\n  \"lastModified\": \"2018-05-07T07:22:43.771Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "JWTExpired",
            "description": "<p>Authorization token has expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AuthorizationHeaderRequired",
            "description": "<p>Authorization header is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"jwt expired\",\n  \"error\":{}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"Authorization header required\",\n  \"error\":{}\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "patch",
    "url": "/services/:id",
    "title": "Patch Existing Service",
    "version": "1.0.0",
    "name": "PatchService",
    "group": "Service",
    "description": "<p>Patch existing service</p>",
    "filename": "lib/http.router.js",
    "groupTitle": "",
    "sampleRequest": [
      {
        "url": "https://majifix-service.herokuapp.com/v1/services/:id"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept",
            "defaultValue": "application/json",
            "description": "<p>Accepted content type</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept-Encoding",
            "defaultValue": "gzip, deflate",
            "description": "<p>Accepted encoding type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Accept\": \"application/json\"\n  \"Authorization\": \"Bearer ey6utFreRdy5\"\n  \"Accept-Encoding\": \"gzip, deflate\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Unique service identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "jurisdiction",
            "defaultValue": "undefined",
            "description": "<p>jurisdiction under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "group",
            "defaultValue": "undefined",
            "description": "<p>service group under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "priority",
            "defaultValue": "undefined",
            "description": "<p>A default priority of the service. It assigned to service request if no priority set.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>A unique identifier of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name.en",
            "description": "<p>A unique human readable name of the service (request type) e.g Water Leakage.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "description",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description.en",
            "description": "<p>A detailed human readable explanation about the service(request type).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "color",
            "description": "<p>A color code(in hexadecimal format) eg. #363636 used to differentiate a service visually from other service.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Date when service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Date when service was last updated</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"_id\": \"5aefff461e0a5527eb1955bd\",\n   \"jurisdiction\": {\n     \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n     \"code\": \"66514685\",\n     \"name\": \"Gana\"\n   },\n   \"group\": {\n     \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n     \"code\": \"4685\",\n     \"name\": \"Gana\"\n   },\n   \"code\": \"05817253\",\n   \"name\": {\n     \"en\": \"Rowe\"\n   },\n   \"description\": {\n     \"en\": \"Eos aut non non delectus dolor eos\".\n   },\n   \"color\": \"#8ced78\",\n   \"createdAt\": \"2018-05-07T07:24:54.490Z\",\n   \"updatedAt\": \"2018-05-07T07:24:54.490Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "JWTExpired",
            "description": "<p>Authorization token has expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AuthorizationHeaderRequired",
            "description": "<p>Authorization header is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"jwt expired\",\n  \"error\":{}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"Authorization header required\",\n  \"error\":{}\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "post",
    "url": "/services",
    "title": "Create New Service",
    "version": "1.0.0",
    "name": "PostService",
    "group": "Service",
    "description": "<p>Create new service</p>",
    "filename": "lib/http.router.js",
    "groupTitle": "",
    "sampleRequest": [
      {
        "url": "https://majifix-service.herokuapp.com/v1/services"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept",
            "defaultValue": "application/json",
            "description": "<p>Accepted content type</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept-Encoding",
            "defaultValue": "gzip, deflate",
            "description": "<p>Accepted encoding type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Accept\": \"application/json\"\n  \"Authorization\": \"Bearer ey6utFreRdy5\"\n  \"Accept-Encoding\": \"gzip, deflate\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Unique service identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "jurisdiction",
            "defaultValue": "undefined",
            "description": "<p>jurisdiction under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "group",
            "defaultValue": "undefined",
            "description": "<p>service group under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "priority",
            "defaultValue": "undefined",
            "description": "<p>A default priority of the service. It assigned to service request if no priority set.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>A unique identifier of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name.en",
            "description": "<p>A unique human readable name of the service (request type) e.g Water Leakage.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "description",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description.en",
            "description": "<p>A detailed human readable explanation about the service(request type).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "color",
            "description": "<p>A color code(in hexadecimal format) eg. #363636 used to differentiate a service visually from other service.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Date when service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Date when service was last updated</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"_id\": \"5aefff461e0a5527eb1955bd\",\n   \"jurisdiction\": {\n     \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n     \"code\": \"66514685\",\n     \"name\": \"Gana\"\n   },\n   \"group\": {\n     \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n     \"code\": \"4685\",\n     \"name\": \"Gana\"\n   },\n   \"code\": \"05817253\",\n   \"name\": {\n     \"en\": \"Rowe\"\n   },\n   \"description\": {\n     \"en\": \"Eos aut non non delectus dolor eos\".\n   },\n   \"color\": \"#8ced78\",\n   \"createdAt\": \"2018-05-07T07:24:54.490Z\",\n   \"updatedAt\": \"2018-05-07T07:24:54.490Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "JWTExpired",
            "description": "<p>Authorization token has expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AuthorizationHeaderRequired",
            "description": "<p>Authorization header is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"jwt expired\",\n  \"error\":{}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"Authorization header required\",\n  \"error\":{}\n}",
          "type": "json"
        }
      ]
    }
  },
  {
    "type": "put",
    "url": "/services/:id",
    "title": "Put Existing Service",
    "version": "1.0.0",
    "name": "PutService",
    "group": "Service",
    "description": "<p>Put existing service</p>",
    "filename": "lib/http.router.js",
    "groupTitle": "",
    "sampleRequest": [
      {
        "url": "https://majifix-service.herokuapp.com/v1/services/:id"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept",
            "defaultValue": "application/json",
            "description": "<p>Accepted content type</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          },
          {
            "group": "Header",
            "type": "String",
            "optional": true,
            "field": "Accept-Encoding",
            "defaultValue": "gzip, deflate",
            "description": "<p>Accepted encoding type</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Header-Example:",
          "content": "{\n  \"Accept\": \"application/json\"\n  \"Authorization\": \"Bearer ey6utFreRdy5\"\n  \"Accept-Encoding\": \"gzip, deflate\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>Unique service identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "jurisdiction",
            "defaultValue": "undefined",
            "description": "<p>jurisdiction under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "group",
            "defaultValue": "undefined",
            "description": "<p>service group under which this service belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "priority",
            "defaultValue": "undefined",
            "description": "<p>A default priority of the service. It assigned to service request if no priority set.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>A unique identifier of the service</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "name",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name.en",
            "description": "<p>A unique human readable name of the service (request type) e.g Water Leakage.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "description",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description.en",
            "description": "<p>A detailed human readable explanation about the service(request type).</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "color",
            "description": "<p>A color code(in hexadecimal format) eg. #363636 used to differentiate a service visually from other service.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>Date when service was created</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>Date when service was last updated</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"_id\": \"5aefff461e0a5527eb1955bd\",\n   \"jurisdiction\": {\n     \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n     \"code\": \"66514685\",\n     \"name\": \"Gana\"\n   },\n   \"group\": {\n     \"_id\": \"5af2fe3ea937a3238bd8e64b\",\n     \"code\": \"4685\",\n     \"name\": \"Gana\"\n   },\n   \"code\": \"05817253\",\n   \"name\": {\n     \"en\": \"Rowe\"\n   },\n   \"description\": {\n     \"en\": \"Eos aut non non delectus dolor eos\".\n   },\n   \"color\": \"#8ced78\",\n   \"createdAt\": \"2018-05-07T07:24:54.490Z\",\n   \"updatedAt\": \"2018-05-07T07:24:54.490Z\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "JWTExpired",
            "description": "<p>Authorization token has expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AuthorizationHeaderRequired",
            "description": "<p>Authorization header is required</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"jwt expired\",\n  \"error\":{}\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\":false,\n  \"message :\"Authorization header required\",\n  \"error\":{}\n}",
          "type": "json"
        }
      ]
    }
  }
] });