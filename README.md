# imap-reader

This library provides the following features

- It allows you to get the header, sender, field, html, date information of all incoming mails belonging to that mail with a mail information.
- It searches for a link that meets the conditions you want in incoming mails for a mail information. If it finds the link, it returns the full link to you.
- Searches for a confirmation code that meets the conditions you want in incoming mails for an incoming mail information

# Usage


```bash
npm i imap-reader
```


### Receive all incoming mails

```js
const imapReader = require("imap-reader");

imapReader.read({
    user: 'rolikrinau@hotmail.com',
    password: 'all7Do61',
    host: 'imap-mail.outlook.com',
    port: 993,
    tls: true,
    type: 'INBOX' // default INBOX if you want to read the spam folder you should type Junk
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

### Search for a link in incoming mails and get the link

```js
const imapReader = require("imap-reader");

imapReader.waitForLink({
    searchLinkString: 'https://mandrillapp.com/track/click/',
    imap: {
        user: 'alawocolynsm@hotmail.com',
        password: 'LKhHSrA80',
        host: 'imap-mail.outlook.com',
        port: 993,
        tls: true
    },
    timeOut: 0,
    type: 'INBOX' // default INBOX if you want to read the spam folder you should type Junk
})
    .then(resp => {
        console.log(resp)
    })
    .catch(err => {
        console.log(err);
    })

```

**searchLinkString:** It scans all the links in the incoming mail html data and if the string you send with this variable is in the link, it returns that link to you in an array.

**timeOut: (Optional)** Specifies how many milliseconds to wait for a link containing a string you send. If not sent, it is set to 2 minutes. 0 If sent, it waits until it arrives. 1 Second = 1000 Milliseconds


<details>
<summary>Sample Successful Response</summary>

```js

{
    status: true,
    data: [
        'https://mandrillapp.com/track/click/31165340/auth0.openai.com?p=eyjzijoilvh4vc1xt2nocmyyvkn1ckturuz4zffwv05jiiwidii6mswicci6intcinvcijozmte2ntm0mcxcinzcijoxlfwidxjsxci6xcjodhrwczpcxfwvxfxcl2f1dggwlm9wzw5has5jb21cxfwvdvxcxc9lbwfpbc12zxjpzmljyxrpb24_dglja2v0ptlobdvzrnzyowjzb0x1au5juktuqjfks0nmbfe3ahf3i1wilfwiawrcijpcimfhnjcwmmrlyjgxodrlmde4ndrlodnmogy1odjlnzuwxcisxcj1cmxfawrzxci6w1wimwm3otuymjnimmq0ymuwmjbmzdjhntbmmmm5yzqxzjewmthlndu0y1wixx0ifq'
        ]
}

```

</details>


<details>
<summary>Sample Failed Response</summary>

```js

{
    status: false,
    data: 'No mail with the link was received within the specified time'
}

```

</details>

### Search for a code that meets the conditions you set in incoming mails


```js

const imapReader = require("imap-reader");

imapReader.waitForCode({
 imap: {
        user: 'lassalnimishr@hotmail.com',
        password: '91XTVPu69',
        host: 'imap-mail.outlook.com',
        port: 993,
        tls: true
    },
    timeOut: 0,
    codeType: 'number',
    codeLength: 9,
    querySelector: 'a',
    type: 'INBOX' // default INBOX if you want to read the spam folder you should type Junk
})
    .then(resp => {
        console.log(resp)
    })
    .catch(err => {
        console.log(err);
    })

```

   **timeOut: (Optional)** Specifies how many milliseconds to wait for a link containing a string you send. If not sent, it is set to 2 minutes. 0 If sent, it waits until it arrives. 1 Second = 1000 Milliseconds
   
   **codeType: (Optional)** Searches only for codes of the type you provide. Species it can take: number, lowerLetter, upperLetter, allLetter, nonAlfanumeric

   **codeLength: (Optional)** Filters strings with the number of characters you give from all html elements.

   **querySelector: (Optional)** It allows you to limit your html content and filter the codes within the html element you select. For example, if it is sent as 'a', it scans the content of the first a tag in the html content.


<details>
<summary>Sample Successful Response</summary>

```js

{
    status: true,
    data: ['542569865']
}

```

</details>


<details>
<summary>Sample Failed Response</summary>

```js

{
    status: false,
    data: 'No mail with the code was received within the specified time'
}

```

</details>



# Contact 
- By email only. zfcsoftware@gmail.com


# License 
- ⚖️ Its protected by Creative Commons ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/))

