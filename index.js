const Imap = require('imap');
const { simpleParser } = require('mailparser');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const read = (data) => {
    return new Promise((resolve, reject) => {
        var global_response = []
        try {
            const imapConfig = data
            const imap = new Imap(imapConfig);
            imap.once('ready', () => {
                imap.openBox('INBOX', false, () => {
                    imap.search(['ALL'], (err, results) => {
                        if (err) {
                            resolve({
                                status: false,
                                data: err.message
                            })
                            return false
                        }
                        if (results.length <= 0) {
                            try {
                                imap.end();
                            } catch (err) { }
                            resolve({
                                status: false,
                                data: 'There is no message'
                            })
                            return false
                        }
                        const f = imap.fetch(results, { bodies: '' });
                        f.on('message', msg => {
                            msg.on('body', stream => {
                                simpleParser(stream, async (err, parsed) => {
                                    global_response.push({
                                        html: parsed.html,
                                        subject: parsed.subject,
                                        from: parsed.from.value,
                                        to: parsed.to.value,
                                        date: parsed.date
                                    })
                                });
                            });
                        });
                        f.once('error', err => {
                            resolve({
                                status: false,
                                data: err.message
                            })
                        });
                        f.once('end', (data) => {
                            imap.end();
                        });
                    });
                });
            });

            imap.once('error', err => {
                // console.log(err);
                resolve({
                    status: false,
                    data: err.message
                })
            });

            imap.once('end', (data) => {
                resolve({
                    status: true,
                    data: {
                        inbox_length: global_response.length,
                        inbox_data: global_response
                    }
                })
            });

            imap.connect();
        } catch (err) {
            resolve({
                status: false,
                data: err.message
            })
        }
    })
};

const sleep = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}

const waitForLink = ({ searchLinkString = 'http', imap, timeOut = 120000 }) => {
    return new Promise(async (resolve, reject) => {
        query = {
            timeOut: timeOut,
            searchLinkString: searchLinkString,
            imap: imap
        }
        query.searchLinkString = String(query.searchLinkString).toLowerCase()
        var wait_time = Date.now()
        var while_status = true
        var response_status = {
            status: false,
            data: 'No mail received'
        }
        var search_link = []
        try {
            while (while_status) {
                try {
                    var query_response = await read(query.imap).catch(err => { return { status: false } })
                    if (query_response.status == true && query_response.data.inbox_data.length > 0) {
                        query_response.data.inbox_data.forEach(item => {
                            try {
                                var new_v = item.html
                                new_v = String(new_v).toLowerCase()
                                const { document } = (new JSDOM(new_v)).window;
                                document.querySelectorAll('a').forEach(i2 => {
                                    try {
                                        if (i2.href.indexOf(query.searchLinkString) > -1) {
                                            search_link.push(i2.href)
                                        }
                                    } catch (err) { }
                                });
                            } catch (err) { }
                        });
                    }

                } catch (err) { response_status.data = 'An error occurred during processing' }

                if (while_status == true) {
                    await sleep(1000)
                }
                if (query.timeOut != 0 && Date.now() > (wait_time + query.timeOut)) {
                    while_status = false
                    response_status.data = 'No mail with the link was received within the specified time'
                }
                if (search_link.length > 0) {
                    while_status = false
                }
            }
        } catch (err) { response_status.data = 'An error occurred during processing' }
        if (search_link.length > 0) {
            response_status.status = true
            response_status.data = search_link
        }
        resolve(response_status)
    })
}

const waitForCode = ({ querySelector = '', codeLength = 0, codeType = '0', imap, timeOut = 120000 }) => {
    return new Promise(async (resolve, reject) => {
        var wait_time = Date.now()
        var while_status = true
        var response_status = {
            status: false,
            data: 'No mail received'
        }
        var search_code = []
        try {
            while (while_status) {
                try {
                    var query_response = await read(imap).catch(err => { return { status: false } })
                    if (query_response.status == true && query_response.data.inbox_data.length > 0) {
                        query_response.data.inbox_data.forEach(item => {
                            var new_v = item.html
                            var { document } = (new JSDOM(new_v)).window;
                            var global_query_item = document
                            var findResponse = false
                            try {
                                try {
                                    if (querySelector && querySelector.length > 0 && document.querySelector(querySelector)) {
                                        global_query_item = document.querySelector(querySelector)
                                        var { document } = (new JSDOM('<div>' + String(global_query_item.innerHTML) + '</div>')).window;
                                        global_query_item = document
                                    }
                                } catch (err) { }
                                try {
                                    if (codeLength > 0) {
                                        findResponse = true
                                        global_query_item.querySelectorAll('*').forEach(item1 => {
                                            try {
                                                if (item1.textContent.length == codeLength) {
                                                    search_code.push(item1.textContent)
                                                }
                                            } catch (err) { }
                                        });
                                    }
                                } catch (err) { }

                                try {
                                    if (codeType != '0') {
                                        findResponse = true
                                        var new_search_code = []
                                        search_code.forEach(item2 => {
                                            item2 = item2.textContent
                                            var q_new = ''
                                            if (codeType == 'number') {
                                                q_new = String(item2).replace(/[^0-9]/g, '')
                                            } else if (codeType == 'lowerLetter') {
                                                q_new = String(item2).replace(/[^a-z]/g, '')
                                            } else if (codeType == 'upperLetter') {
                                                q_new = String(item2).replace(/[^A-Z]/g, '')
                                            } else if (codeType == 'allLetter') {
                                                q_new = String(item2).replace(/[^a-zA-Z]/g, '')
                                            } else if (codeType == 'nonAlfanumeric') {
                                                q_new = String(item2).replace(/[a-zA-Z0-9]/g, '');
                                            }
                                            if (item2.length == q_new.length) {
                                                new_search_code.push(item2)
                                            }
                                        });
                                        search_code = new_search_code
                                    }

                                } catch (err) { }
                                if (findResponse == false) {
                                    search_code.push(global_query_item.textContent)
                                }

                            } catch (err) { }
                        });
                    }

                } catch (err) { }


                if (while_status == true) {
                    await sleep(1000)
                }
                if (timeOut != 0 && Date.now() > (wait_time + timeOut)) {
                    while_status = false
                    response_status.data = 'No mail with the code was received within the specified time'
                }
                if (search_code.length > 0) {
                    while_status = false
                }
            }

        } catch (err) { response_status.data = 'An error occurred during processing' }

        if (search_code.length > 0) {
            response_status.status = true
            search_code = search_code.filter((item, index, self) => {
                return self.indexOf(item) === index;
            });
            response_status.data = search_code
        }
        resolve(response_status)
    })
}

module.exports = {
    read,
    waitForLink,
    waitForCode
}