const Imap = require('imap');
const { simpleParser } = require('mailparser');
const fs = require('fs')
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



module.exports = {
    read
}