---
title: 'Anyone can build: node.js+ Cosmos DB in Azure '
date: 2021-03-17 23:48:05 Z
categories:
- azure
tags:
- azure
- microsoft
layout: post
subtitle: Let's Learn and Build simple web application using Azure functions and Cosmos
  DB.
description: How to build and deploy A MERN stack application on Microsoft azure from
  scratch step-by-step.Best Steps for beginers 101.
image: https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80
optimized_image: https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80
author: Shubhendu Shubham
paginate: true
---

Before Starting our project let's Quickly learn about **Cosmos DB**

## What is Cosmos DB ?

Cosmos DB is a planet scale DB, No SQL JSON DB with multi API support provided by [Microsoft Azure](https://azure.microsoft.com/en-us/)

![cosmos DB](https://res.cloudinary.com/hugs4bugs/image/upload/v1616362364/Azure/23_sqxpoz.jpg)

## Planet scale DB means?

It means that we can build our primary DataBase in one region and setup different secondary Databases in different geo locations to avoid much latency and smoother user experiences.
Whenever our primary Database goes down, any one these secondary Database can come as primary Database.

![planet Scale](https://res.cloudinary.com/hugs4bugs/image/upload/v1616362726/Azure/25_yxlnqu.jpg)

## Multi API Support

Cosmos DB stores Data iin JSON Format having multiple API support, which means that Data stores in JSON Format can be used as any API format.

![API](https://res.cloudinary.com/hugs4bugs/image/upload/v1616362726/Azure/24_hpsotg.jpg)

Now we might be confused why Cosmos DB instead of [Amazon Dynamo DB](https://aws.amazon.com/dynamodb/). So here are the few features of Cosmos DB with Amazon Dynamo DB comparison.
In Cosmos DB server reads and writes locally for low latency and 99.999% high availability around the world. It avoids extreme tradeofs in consistency, performance,and availability with five consistency models.
Apart from these, it's multi-model with wire protocol-compatible API endpoints for cassandra, MongoDB, SQL, Gremlin and Table along with built-in support for Apache spark and Jupyter notebooks.

### Comparison

<style type="text/css">
.tg  {border-collapse:collapse;border-color:#9ABAD9;border-spacing:0;}
.tg td{background-color:#EBF5FF;border-color:#9ABAD9;border-style:solid;border-width:1px;color:#444;
  font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{background-color:#409cff;border-color:#9ABAD9;border-style:solid;border-width:1px;color:#fff;
  font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-phtq{background-color:#D2E4FC;border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-eqm3{border-color:inherit;font-size:20px;text-align:left;vertical-align:top}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-c4qv{background-color:#F0F0F0;border-color:inherit;color:#222;text-align:left;vertical-align:top}
</style>

<table class="tg">
<thead>
  <tr>
    <th class="tg-eqm3"><span style="font-weight:bold">Name</span></th>
    <th class="tg-eqm3"><span style="font-weight:bold">Azure Cosmos DB</span></th>
    <th class="tg-eqm3"><span style="font-weight:bold;font-style:normal">Amazon DynamoDB</span><br></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold">Database Model</span></td>
    <td class="tg-phtq">Document Store<br>Graph DBMS<br>Key-value Store<br>wide-column Store</td>
    <td class="tg-0pky">Document Store<br>key-value Store</td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold">Data Scheme</span></td>
    <td class="tg-phtq">Schema-free</td>
    <td class="tg-0pky">Schema-free</td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold">SQL</span></td>
    <td class="tg-phtq">SQL-like Query language</td>
    <td class="tg-0pky">NO</td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold">API &amp; Access Method </span></td>
    <td class="tg-phtq"><span style="font-weight:400;font-style:normal">DocumentDB API</span><br><br><span style="font-weight:400;font-style:normal">Graph API (Gremlin)</span><br><br><span style="font-weight:400;font-style:normal">MongoDB API</span><br><br><span style="font-weight:400;font-style:normal">RESTful HTTP API</span><br><br><span style="font-weight:400;font-style:normal">Table API</span></td>
    <td class="tg-0pky">RESTful HTTP API</td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold">Supported programming languages</span></td>
    <td class="tg-phtq"><span style="font-weight:400;font-style:normal">.Net</span><br><br><span style="font-weight:400;font-style:normal">C#</span><br><br><span style="font-weight:400;font-style:normal">Java</span><br><br><span style="font-weight:400;font-style:normal">JavaScript</span><br><br><span style="font-weight:400;font-style:normal">JavaScript (Node.js)</span><br><br><span style="font-weight:400;font-style:normal">MongoDB client drivers written for various programming languages</span><br><br><span style="font-weight:400;font-style:normal">Python</span></td>
    <td class="tg-0pky"><span style="font-weight:400;font-style:normal">.Net</span><br><br><span style="font-weight:400;font-style:normal">ColdFusion</span><br><br><span style="font-weight:400;font-style:normal">Erlang</span><br><br><span style="font-weight:400;font-style:normal">Groovy</span><br><br><span style="font-weight:400;font-style:normal">Java</span><br><br><span style="font-weight:400;font-style:normal">JavaScript</span><br><br><span style="font-weight:400;font-style:normal">Perl</span><br><br><span style="font-weight:400;font-style:normal">PHP</span><br><br><span style="font-weight:400;font-style:normal">Python</span><br><br><span style="font-weight:400;font-style:normal">Ruby</span></td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold;font-style:normal">Server-side scripts</span></td>
    <td class="tg-phtq">JavaScript</td>
    <td class="tg-0pky">NO</td>
  </tr>
  <tr>
    <td class="tg-c4qv"><span style="font-weight:bold">Triggers</span></td>
    <td class="tg-phtq">JavaScript</td>
    <td class="tg-0pky">Yes ( AWS lambda)</td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold">Partitioning methods</span></td>
    <td class="tg-phtq">Sharding</td>
    <td class="tg-0pky">Sharding</td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold">Replication methods</span></td>
    <td class="tg-phtq">Yes</td>
    <td class="tg-0pky">yes</td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold">MapReduce</span></td>
    <td class="tg-phtq">with Hadoop integration</td>
    <td class="tg-0pky">NO</td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold">Consistency concepts</span></td>
    <td class="tg-phtq"><span style="font-weight:400;font-style:normal">Bounded Staleness</span><br><br><span style="font-weight:400;font-style:normal">Consistent Prefix</span><br><br><span style="font-weight:400;font-style:normal">Eventual Consistency</span><br><br><span style="font-weight:400;font-style:normal">Immediate Consistency</span><br><span style="font-weight:400;font-style:normal"> </span><br>Session Consistency</td>
    <td class="tg-0pky"><span style="font-weight:400;font-style:normal">Eventual Consistency</span><br><br><span style="font-weight:400;font-style:normal">Immediate Consistency</span></td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold;font-style:normal">Transaction concepts</span></td>
    <td class="tg-phtq"><span style="font-weight:400;font-style:normal">Multi-item ACID transactions with snapshot isolation within a partition</span></td>
    <td class="tg-0pky">ACID</td>
  </tr>
  <tr>
    <td class="tg-0pky"><span style="font-weight:bold;font-style:normal">Foreign keys</span></td>
    <td class="tg-phtq">NO</td>
    <td class="tg-0pky">NO</td>
  </tr>
</tbody>
</table>

Now let's Jump onto Azure portal for hands on

## Creating a Resource Group

Steps:-

- Login to to [Microsoft Azure](https://azure.microsoft.com/en-in/) portal.
- Click on Resource group to build a resource group
  ![resource group](https://res.cloudinary.com/hugs4bugs/image/upload/v1616223591/Azure/4_cpomxq.jpg)
- Fill all the details in 3 tabs respectively and Feel free to choose **Region** according to your use case.
  ![Resouce Group](https://res.cloudinary.com/hugs4bugs/image/upload/v1616226067/Azure/5_b2pn4x.jpg)
- After Filling all details, click on **Create** button.
  ![Resource Group](https://res.cloudinary.com/hugs4bugs/image/upload/v1616226424/Azure/6_umv9uf.jpg)
- Click on notification icon to see all activites and visit resource Group by simply clicking on **Go to Resource Group** button.
  ![resource group](https://res.cloudinary.com/hugs4bugs/image/upload/v1616226768/Azure/7_mwm78n.jpg)

## Creating Cosmos DB

steps:-

- Click on search bar, and type **Cosmos DB**.
- **Create Azure Cosmos DB Account** page will appear.
- Fill all the deatils and in Resource section select the exsisting you'll find all your resources there.
  ![Cosmos DB](https://res.cloudinary.com/hugs4bugs/image/upload/v1616227464/Azure/8_i3hpal.jpg)
  ![Cosmo DB](https://res.cloudinary.com/hugs4bugs/image/upload/v1616276671/Azure/15_ngay19.jpg)

- In Networking section we can select what kind of network we wanna to allow on our DB. It can be either Private, Public and All types. Here I'll choose All kind of Network.
  ![Networking](https://res.cloudinary.com/hugs4bugs/image/upload/v1616227964/Azure/9_rvh026.jpg)
- In Back up Policy We can set our policy too, but here I am going for Default one.
- In Encryption and Tags I'll go for Default.
- Click on Create in Review + Create tab
  ![create](https://res.cloudinary.com/hugs4bugs/image/upload/v1616278561/Azure/16_jil7sf.jpg)
- As soon as We create, Deployment in progress message will display. Even We can check it out from notification icon.
  ![deploying](https://res.cloudinary.com/hugs4bugs/image/upload/v1616228855/Azure/11_q6lybf.jpg)
- After Successful deploy it will show like this
  ![successful Deployed](https://res.cloudinary.com/hugs4bugs/image/upload/v1616230242/Azure/12_zzhr5l.jpg)
- Click on Go to the resource.
- Click on Overview section , it'll display all informations like Status : Online/ offline , URL, Subscription
  ![overview](https://res.cloudinary.com/hugs4bugs/image/upload/v1616230848/Azure/13_jvlspl.jpg)
- Click on JSON view for JSON format

```JSON

{
    "id": "/your ID'll be here",
    "name": "fun",
    "location": "West US",
    "type": "Microsoft.DocumentDB/databaseAccounts",
    "kind": "MongoDB",
    "tags": {
        "defaultExperience": "Azure Cosmos DB for MongoDB API",
        "hidden-cosmos-mmspecial": "",
        "CosmosAccountType": "Non-Production"
    },
    "systemData": {
        "createdAt": "2021-03-20T21:17:50.268017Z"
    },
    "properties": {
        "provisioningState": "Succeeded",
        "documentEndpoint": "https://fun.documents.azure.com:443/",
        "mongoEndpoint": "https://fun.mongo.cosmos.azure.com:443/",
        "enableAutomaticFailover": false,
        "enableMultipleWriteLocations": false,
        "enablePartitionKeyMonitor": false,
        "isVirtualNetworkFilterEnabled": false,
        "virtualNetworkRules": [],
        "EnabledApiTypes": "MongoDB",
        "disableKeyBasedMetadataWriteAccess": false,
        "enableFreeTier": false,
        "enableAnalyticalStorage": false,
        "instanceId": "57aee621-ad53-4d83-98e2-bff824c16562",
        "createMode": "Default",
        "databaseAccountOfferType": "Standard",
        "ipRangeFilter": "",
        "consistencyPolicy": {
            "defaultConsistencyLevel": "Session",
            "maxIntervalInSeconds": 5,
            "maxStalenessPrefix": 100
        },
        "apiProperties": {
            "serverVersion": "3.6"
        },
        "configurationOverrides": {
            "EnableBsonSchema": "True"
        },
        "writeLocations": [
            {
                "id": "fun-westus",
                "locationName": "West US",
                "documentEndpoint": "https://fun-westus.documents.azure.com:443/",
                "provisioningState": "Succeeded",
                "failoverPriority": 0,
                "isZoneRedundant": false
            }
        ],
        "readLocations": [
            {
                "id": "fun-westus",
                "locationName": "West US",
                "documentEndpoint": "https://fun-westus.documents.azure.com:443/",
                "provisioningState": "Succeeded",
                "failoverPriority": 0,
                "isZoneRedundant": false
            }
        ],
        "locations": [
            {
                "id": "fun-westus",
                "locationName": "West US",
                "documentEndpoint": "https://fun-westus.documents.azure.com:443/",
                "provisioningState": "Succeeded",
                "failoverPriority": 0,
                "isZoneRedundant": false
            }
        ],
        "failoverPolicies": [
            {
                "id": "fun-westus",
                "locationName": "West US",
                "failoverPriority": 0
            }
        ],
        "cors": [],
        "capabilities": [
            {
                "name": "EnableMongo"
            },
            {
                "name": "DisableRateLimitingResponses"
            }
        ],
        "backupPolicy": {
            "type": "Periodic",
            "periodicModeProperties": {
                "backupIntervalInMinutes": 240,
                "backupRetentionIntervalInHours": 8,
                "backupStorageRedundancy": "Geo"
            }
        }
    }
}
```

- In activity log it'll display all our recent activities like:-
  ![activities](https://res.cloudinary.com/hugs4bugs/image/upload/v1616231401/Azure/14_htpaad.jpg)

## Creating a Simple MERN Stack App

It will have following features :-

- Create Post
- Read Post
- Update Post
- Like Post
- Delete Post
  Later we will deploy this to Azure webApp having backend as **Cosmos DB** .

## Let's start Our Project

steps :-

- Open termial and make a folder/workspace **Project**

```folder
cd Desktop
mkdir Project
```

- Open Project folder in your favourite editor mine is [Vs Code](https://code.visualstudio.com/)
- create two separte folders inside your project for **client** and **server** side

```client
mkdir client
mkdir server
```

- change directory to **client** and create a react App

```commands
cd client
npx create-react-app ./
```

- In **Server** folder create a file named as _index.js_

```command
cd server
touch index.js
```

- To install dependencies we need a file called _package.json_ inside **server** folder

```command
npm init -y
```

- Dependencies are :-

```Dependency
npm install body-parser cors express mongoose nodemon
```

- After installation add **"type" : "module",** And
  package.json file will look like :-

```JSON
{
  "name": "mern-stack-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "nodemon index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "mongoose": "^5.9.29"
  }
}
```

- Now go to **client** folder and install these dependencies

```code
cd client
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
```

- Install dependencies for client side

```code
npm install axios momet react-file-base64 redux redux-thunk
```

## Building UI

**_index.js_**

```index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { reducers } from './reducers';
import App from './App';
import './index.css';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

```

## Adding Styles

**_styles.js_**

```style
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    color: 'rgba(0,183,255, 1)',
  },
  image: {
    marginLeft: '15px',
  },
}));
```

```index.css
body {
    background-color: rgba(0,183,255, 1);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='540' height='450' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='.1'%3E%3Cpolygon fill='%23444' points='90 150 0 300 180 300'/%3E%3Cpolygon points='90 150 180 0 0 0'/%3E%3Cpolygon fill='%23AAA' points='270 150 360 0 180 0'/%3E%3Cpolygon fill='%23DDD' points='450 150 360 300 540 300'/%3E%3Cpolygon fill='%23999' points='450 150 540 0 360 0'/%3E%3Cpolygon points='630 150 540 300 720 300'/%3E%3Cpolygon fill='%23DDD' points='630 150 720 0 540 0'/%3E%3Cpolygon fill='%23444' points='810 150 720 300 900 300'/%3E%3Cpolygon fill='%23FFF' points='810 150 900 0 720 0'/%3E%3Cpolygon fill='%23DDD' points='990 150 900 300 1080 300'/%3E%3Cpolygon fill='%23444' points='990 150 1080 0 900 0'/%3E%3Cpolygon fill='%23DDD' points='90 450 0 600 180 600'/%3E%3Cpolygon points='90 450 180 300 0 300'/%3E%3Cpolygon fill='%23666' points='270 450 180 600 360 600'/%3E%3Cpolygon fill='%23AAA' points='270 450 360 300 180 300'/%3E%3Cpolygon fill='%23DDD' points='450 450 360 600 540 600'/%3E%3Cpolygon fill='%23999' points='450 450 540 300 360 300'/%3E%3Cpolygon fill='%23999' points='630 450 540 600 720 600'/%3E%3Cpolygon fill='%23FFF' points='630 450 720 300 540 300'/%3E%3Cpolygon points='810 450 720 600 900 600'/%3E%3Cpolygon fill='%23DDD' points='810 450 900 300 720 300'/%3E%3Cpolygon fill='%23AAA' points='990 450 900 600 1080 600'/%3E%3Cpolygon fill='%23444' points='990 450 1080 300 900 300'/%3E%3Cpolygon fill='%23222' points='90 750 0 900 180 900'/%3E%3Cpolygon points='270 750 180 900 360 900'/%3E%3Cpolygon fill='%23DDD' points='270 750 360 600 180 600'/%3E%3Cpolygon points='450 750 540 600 360 600'/%3E%3Cpolygon points='630 750 540 900 720 900'/%3E%3Cpolygon fill='%23444' points='630 750 720 600 540 600'/%3E%3Cpolygon fill='%23AAA' points='810 750 720 900 900 900'/%3E%3Cpolygon fill='%23666' points='810 750 900 600 720 600'/%3E%3Cpolygon fill='%23999' points='990 750 900 900 1080 900'/%3E%3Cpolygon fill='%23999' points='180 0 90 150 270 150'/%3E%3Cpolygon fill='%23444' points='360 0 270 150 450 150'/%3E%3Cpolygon fill='%23FFF' points='540 0 450 150 630 150'/%3E%3Cpolygon points='900 0 810 150 990 150'/%3E%3Cpolygon fill='%23222' points='0 300 -90 450 90 450'/%3E%3Cpolygon fill='%23FFF' points='0 300 90 150 -90 150'/%3E%3Cpolygon fill='%23FFF' points='180 300 90 450 270 450'/%3E%3Cpolygon fill='%23666' points='180 300 270 150 90 150'/%3E%3Cpolygon fill='%23222' points='360 300 270 450 450 450'/%3E%3Cpolygon fill='%23FFF' points='360 300 450 150 270 150'/%3E%3Cpolygon fill='%23444' points='540 300 450 450 630 450'/%3E%3Cpolygon fill='%23222' points='540 300 630 150 450 150'/%3E%3Cpolygon fill='%23AAA' points='720 300 630 450 810 450'/%3E%3Cpolygon fill='%23666' points='720 300 810 150 630 150'/%3E%3Cpolygon fill='%23FFF' points='900 300 810 450 990 450'/%3E%3Cpolygon fill='%23999' points='900 300 990 150 810 150'/%3E%3Cpolygon points='0 600 -90 750 90 750'/%3E%3Cpolygon fill='%23666' points='0 600 90 450 -90 450'/%3E%3Cpolygon fill='%23AAA' points='180 600 90 750 270 750'/%3E%3Cpolygon fill='%23444' points='180 600 270 450 90 450'/%3E%3Cpolygon fill='%23444' points='360 600 270 750 450 750'/%3E%3Cpolygon fill='%23999' points='360 600 450 450 270 450'/%3E%3Cpolygon fill='%23666' points='540 600 630 450 450 450'/%3E%3Cpolygon fill='%23222' points='720 600 630 750 810 750'/%3E%3Cpolygon fill='%23FFF' points='900 600 810 750 990 750'/%3E%3Cpolygon fill='%23222' points='900 600 990 450 810 450'/%3E%3Cpolygon fill='%23DDD' points='0 900 90 750 -90 750'/%3E%3Cpolygon fill='%23444' points='180 900 270 750 90 750'/%3E%3Cpolygon fill='%23FFF' points='360 900 450 750 270 750'/%3E%3Cpolygon fill='%23AAA' points='540 900 630 750 450 750'/%3E%3Cpolygon fill='%23FFF' points='720 900 810 750 630 750'/%3E%3Cpolygon fill='%23222' points='900 900 990 750 810 750'/%3E%3Cpolygon fill='%23222' points='1080 300 990 450 1170 450'/%3E%3Cpolygon fill='%23FFF' points='1080 300 1170 150 990 150'/%3E%3Cpolygon points='1080 600 990 750 1170 750'/%3E%3Cpolygon fill='%23666' points='1080 600 1170 450 990 450'/%3E%3Cpolygon fill='%23DDD' points='1080 900 1170 750 990 750'/%3E%3C/g%3E%3C/svg%3E");
}
```

## Adding Constants

```actionType.js
export const CREATE = 'CREATE';
export const UPDATE = 'UPDATE';
export const DELETE = 'DELETE';
export const FETCH_ALL = 'FETCH_ALL';
export const LIKE = 'LIKE';
```

## Adding Form Components

```form

import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';

import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ creator: '', title: '', message: '', tags: '', selectedFile: '' });
  const post = useSelector((state) => (currentId ? state.posts.find((message) => message._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ creator: '', title: '', message: '', tags: '', selectedFile: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createPost(postData));
      clear();
    } else {
      dispatch(updatePost(currentId, postData));
      clear();
    }
  };

  return (
    <Paper className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post.title}"` : 'Creating a FUN EVENT'}</Typography>
        <TextField name="creator" variant="outlined" label="Creator" fullWidth value={postData.creator} onChange={(e) => setPostData({ ...postData, creator: e.target.value })} />
        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
        <TextField name="tags" variant="outlined" label="Tags (coma separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;
```

## Styling Form

```style

import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fileInput: {
    width: '97%',
    margin: '10px 0',
  },
  buttonSubmit: {
    marginBottom: 10,
  },
}));
```

## API Call

```API
import axios from 'axios';

const url = 'http://localhost:10255/posts';

export const fetchPosts = () => axios.get(url);
export const createPost = (newPost) => axios.post(url, newPost);
export const likePost = (id) => axios.patch(`${url}/${id}/likePost`);
export const updatePost = (id, updatedPost) => axios.patch(`${url}/${id}`, updatedPost);
export const deletePost = (id) => axios.delete(`${url}/${id}`);
```

## Action

```post

import { FETCH_ALL, CREATE, UPDATE, DELETE, LIKE } from '../constants/actionTypes';

import * as api from '../api/index.js';

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts();

    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);

    dispatch({ type: LIKE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error.message);
  }
};
```

**In server side**

## Creating Controllers

```post
import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const { title, message, selectedFile, creator, tags } = req.body;

    const newPostMessage = new PostMessage({ title, message, selectedFile, creator, tags })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage );
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });

    res.json(updatedPost);
}


export default router;
```

## Creating models

```postMessage
import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likeCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var PostMessage = mongoose.model('PostMessage', postSchema);

export default PostMessage;
```

## Creating Routes

Adding Post.js

```posts
import express from 'express';

import { getPosts, getPost, createPost, updatePost, likePost, deletePost } from '../controllers/posts.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', createPost);
router.get('/:id', getPost);
router.patch('/:id', updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/likePost', likePost);

export default router;

```

**Connect our Node.js application to the database**

Replace the two <cosmosdb-name> placeholders with your Cosmos account name.

```Js
'use strict';

module.exports = {
  db: {
    uri: 'mongodb://<cosmosdb-name>:<primary_master_key>@<cosmosdb-name>.documents.azure.com:10255/mean-dev?ssl=true&sslverifycertificate=false'
  }
};
```

## Retrieve the key

In Order to connect our Cosmos DB, we need DB Key.Here we can use the **az cosmosdb** keys list command to retrieve the primary key.

```az

az cosmosdb keys list --name <cosmosdb-name> --resource-group myResourceGroup --query "primaryMasterKey"
```

**_Output_**

```JSON
"RUayjYjixJDWG5xTqIiXjC..."
```

## Run application locally

```Locally
cd client
npm start
and in other terminal
cd server
npm start
```

Go to the browser and type **http://localhost:3000**

![Running Locally](https://res.cloudinary.com/hugs4bugs/image/upload/v1616309489/Azure/17_f12hld.jpg)

## Retrieve data in Data Explorer

Data stored in a Cosmos database is available to view and query in the Azure portal.

![Data](https://res.cloudinary.com/hugs4bugs/image/upload/v1616310475/Azure/18_xxwwtj.jpg)

## Creating Static Azure Web App

- click on the search console and Type **Azure static web Apps**
- select Static web App preview Option

![static Web App](https://res.cloudinary.com/hugs4bugs/image/upload/v1616359384/Azure/19_b4pc9v.jpg)

- Connect with Github Repository for CI/CD build.
- Edit workflow.yml file to setup CI/CD

```workflow

 name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - master
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - master

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v2
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v0.0.1-preview
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_SKY_033A9731E }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "client" # App source code path
          api_location: "client/src/api" # Api source code path - optional
          output_location: "build" # Built app content directory - optional

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v0.0.1-preview
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_AMBITIOUS_SKY_033A9731E }}
          action: "close"

```

_yml will build automatically whenever we push code to this repo in master branch_
![CI/CD](https://res.cloudinary.com/hugs4bugs/image/upload/v1616360230/Azure/20_iynida.jpg)

## After Deployment

![Deployment](https://res.cloudinary.com/hugs4bugs/image/upload/v1616360229/Azure/21_srvyte.jpg)

**Before Deployment make sure to change uri in the _db_ object** like :-

```env

'mongodb://<cosmosdb-name>:<primary_master_key>@<cosmosdb-name>.documents.azure.com:10255/mean?ssl=true&sslverifycertificate=false',
```

<a href="https://github.com/sivolko/fun" class="btn btn-outline-warning" role="button" aria-pressed="true">Demo & Source Code</a>
