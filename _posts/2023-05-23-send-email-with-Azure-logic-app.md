---
layout: post
title: Automate Email with Azure Logic App
subtitle: Automation with playbook
description: Automatically send email with attachment via Microsoft logic apps and Blob storage 
image: https://d3nn873nee648n.cloudfront.net/900x600/19765/300-SM960337.jpg
optimized_image: https://d3nn873nee648n.cloudfront.net/900x600/19765/300-SM960337.jpg
author: Shubhendu Shubham
date: 2023-04-30 00:00:00 Z
categories:
- azure
tags:
- azure
- blob storage 
- logic app
- cloud
---
Before start,let's understand the usecase of Logic App and our requirements. 

We need to create an automated email flow with attachment with particular email group or people. So for this we need to create a logic app with storage account which contains our email attachment. Now let's divide it into 2 parts 

1. Storage account creation 
2. Logic App

## Requirements :-

1. Azure Subscription 
2. Storage Account access
3. Logic App contributor access
4. Email group either outlook or gmail 

Steps :-

* Signin to [Azure Portal](https://portal.azure.com) and search storage account and click on create and fill deatails for storage account.

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690656151/Azure/1_toehv3.jpg)

* In Redundancy select LRS i.e locally-redundant storage to reduce cost. By default it comes with Geo Redundant storage 

* Under Advance section change blob storage access tier type from Hot to cool unless you are using it for enterprise and you need to store all data for GDPR compliance. And Enable large file share option too . But large file storage option do not have the ability to convert to geo-redundant storage offerings and upgrade is permanent.

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690656676/Azure/3_ntlprr.jpg)

* Under networking section enable network for selected VM and IP address for security and avoid unwanted traffic . We can use Private network access too. 

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690656940/Azure/4_by7ygi.jpg)

* Under Data Protection Tab, enable all features as per your GDPR compliance and requirements.

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690657417/Azure/5_iuiax0.jpg)

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690657494/Azure/6_ylmyox.jpg)

* To reduce cost make sure to tick delete icon and set no of days.

* If one want to encrypt the storage account feel free to use encryption tab.

* Review and hit create

## Storage and Container creation 

* From left tab select Data storage drop down and click container 

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690657975/Azure/7_iloabc.jpg)

* Click on create and put unique name, from public access level dropdown select Blob storage

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690658206/Azure/8_uw60s2.jpg)

* After successful creation , container will look like this 

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690658433/Azure/9_joeltj.jpg)

we'll be using upload feature to upload attachment there and logic app will fetch it out.

Now jump over 2nd part i.e 

## Logic APP creation 

* While Creating logic app make sure to select consumption based to reduce cost 

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690658739/Azure/10_pd7ow7.jpg)

* Click on blank logic app 

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690697910/Azure/11_brbd2j.jpg)

* Select trigger as Blob is added or modified properties only v2 

![Image ](https://res.cloudinary.com/hugs4bugs/image/upload/v1690698474/Azure/12_ahsnwo.jpg)

* Fill Azure Blob storage 

![image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690699111/Azure/13_yir6oj.jpg  )

* Select how often blob storage should scan 

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690699629/Azure/14_rbprab.jpg)

* Fetch Blob storage 

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690699853/Azure/15_s4uuod.jpg)

* Send Email connect 

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690700255/Azure/16_krj5rl.jpg)

* After successful run it'll trigger 

![Immage](https://res.cloudinary.com/hugs4bugs/image/upload/v1690701238/Azure/17_p4one2.jpg)

* Recipient Mail snapshot 

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690703857/Azure/18_g57tqm.jpg)

* Senders Mail snapshot

![Image](https://res.cloudinary.com/hugs4bugs/image/upload/v1690704324/Azure/19_tgp2hj.jpg)

## Code Snippet : Logic App

```

{
    "definition": {
        "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
        "actions": {
            "Get_blob_content_(V2)": {
                "inputs": {
                    "host": {
                        "connection": {
                            "name": "@parameters('$connections')['azureblob_1']['connectionId']"
                        }
                    },
                    "method": "get",
                    "path": "/v2/datasets/@{encodeURIComponent(encodeURIComponent('AccountNameFromSettings'))}/files/@{encodeURIComponent(encodeURIComponent('/email/',triggerBody()?['Name']))}/content"
                },
                "runAfter": {},
                "type": "ApiConnection"
            },
            "Send_an_email_(V2)": {
                "inputs": {
                    "body": {
                        "Attachments": [
                            {
                                "ContentBytes": "@{base64(body('Get_blob_content_(V2)'))}",
                                "Name": "@triggerBody()?['Name']"
                            }
                        ],
                        "Body": "<p>Hello ,<br>\n<br>\nThis is automated mail from the &nbsp;Azure logic app</p>",
                        "Subject": "Auto Mail from Logic App ",
                        "To": "shubhendushubham98@gmail.com"
                    },
                    "host": {
                        "connection": {
                            "name": "@parameters('$connections')['office365']['connectionId']"
                        }
                    },
                    "method": "post",
                    "path": "/v2/Mail"
                },
                "runAfter": {
                    "Get_blob_content_(V2)": [
                        "Succeeded"
                    ]
                },
                "type": "ApiConnection"
            }
        },
        "contentVersion": "1.0.0.0",
        "outputs": {},
        "parameters": {
            "$connections": {
                "defaultValue": {},
                "type": "Object"
            }
        },
        "triggers": {
            "When_a_blob_is_added_or_modified_(properties_only)_(V2)": {
                "evaluatedRecurrence": {
                    "frequency": "Second",
                    "interval": 5
                },
                "inputs": {
                    "host": {
                        "connection": {
                            "name": "@parameters('$connections')['azureblob_1']['connectionId']"
                        }
                    },
                    "method": "get",
                    "path": "/v2/datasets/@{encodeURIComponent(encodeURIComponent('AccountNameFromSettings'))}/triggers/batch/onupdatedfile",
                    "queries": {
                        "checkBothCreatedAndModifiedDateTime": false,
                        "folderId": "JTJmZW1haWw=",
                        "maxFileCount": 1
                    }
                },
                "metadata": {
                    "JTJmZW1haWw=": "/email"
                },
                "recurrence": {
                    "frequency": "Second",
                    "interval": 5
                },
                "splitOn": "@triggerBody()",
                "type": "ApiConnection"
            }
        }
    },
    "parameters": {
        "$connections": {
            "value": {
                "azureblob_1": {
                    "connectionId": "/subscriptions/d2ce31d1-d98f-41a0-ba3f-9db5b1e7bf9f/resourceGroups/Alert-RG/providers/Microsoft.Web/connections/azureblob-3",
                    "connectionName": "azureblob-3",
                    "id": "/subscriptions/d2ce31d1-d98f-41a0-ba3f-9db5b1e7bf9f/providers/Microsoft.Web/locations/eastus/managedApis/azureblob"
                },
                "office365": {
                    "connectionId": "/subscriptions/d2ce31d1-d98f-41a0-ba3f-9db5b1e7bf9f/resourceGroups/Alert-RG/providers/Microsoft.Web/connections/office365-1",
                    "connectionName": "office365-1",
                    "id": "/subscriptions/d2ce31d1-d98f-41a0-ba3f-9db5b1e7bf9f/providers/Microsoft.Web/locations/eastus/managedApis/office365"
                }
            }
        }
    }
}

```

[**Github Repo Link**](https://github.com/sivolko/EmailwithAttachment)


## Quick Deployment

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fsivolko%2FEmailwithAttachment%2Fmain%2FEmailwithAttachment.JSON) 
