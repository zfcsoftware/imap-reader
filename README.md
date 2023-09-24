# imap-reader

-   Returns the header, mail and html information of all messages in the mailbox of the mail you give imap information in array type.

# Usage

```bash
npm i imap-reader
```


```js
const imapReader = require("imap-reader");

imapReader.read({
    user: 'rolikrinau@hotmail.com',
    password: 'all7Do61',
    host: 'imap-mail.outlook.com',
    port: 993,
    tls: true
})
.then(response=>{
    console.log(response)
})
.catch(err=>{
    console.log(err)
})
```

<details>
<summary>Sample Successful Response</summary>

```js
{
    "status": true,
    "data": {
        "inbox_length": 3,
        "inbox_data": [
            {
                "html": "<html data>",
                "subject": "Yeni Outlook.com hesabınıza hoş geldiniz",
                "from": [
                    {
                        "address": "no-reply@microsoft.com",
                        "name": "Outlook Ekibi"
                    }
                ],
                "to": [
                    {
                        "address": "rolikrinau@hotmail.com",
                        "name": "roli krina"
                    }
                ],
                "date": "2023-09-23T16:28:53.000Z"
            },
            {
                "html": "<html data>",
                "subject": "OpenAI - Verify your email",
                "from": [
                    {
                        "address": "noreply@tm.openai.com",
                        "name": "OpenAI"
                    }
                ],
                "to": [
                    {
                        "address": "rolikrinau@hotmail.com",
                        "name": ""
                    }
                ],
                "date": "2023-09-23T16:29:00.000Z"
            },
            {
                "html": "<html data>",
                "subject": "Test Mail",
                "from": [
                    {
                        "address": "help@wmaster.net",
                        "name": "WM AI"
                    }
                ],
                "to": [
                    {
                        "address": "rolikrinau@hotmail.com",
                        "name": ""
                    }
                ],
                "date": "2023-09-23T17:11:59.000Z"
            }
        ]
    }
}

```

</details>

<details>
<summary>Sample Failed Response</summary>

```js
{
    status: false,
    data: 'LOGIN failed.'
}

```

</details>


# License 
- ⚖️ Its protected by Creative Commons ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/))

