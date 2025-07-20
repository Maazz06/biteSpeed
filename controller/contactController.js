const Contact = require('../model/contact');
const { Op } = require('sequelize');

const identify = async (req, res) => {
    try {
        const { email = null, phoneNumber = null } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({ status: false, error: 'At least email or phoneNumber required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ status: false, error: 'Invalid email format' });
        }

        let contacts = await Contact.findAll({
            where: {
                [Op.or]: [
                    { email },
                    { phoneNumber }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        let primaryContact = null;
        const emails = new Set();
        const phoneNumbers = new Set();
        const secondaryContactIds = [];

        const primaryContacts = contacts.filter(c => c.linkPrecedence === 'primary');
        if (primaryContacts.length > 1) {
            // 0th element becomes primary as its sorted in ascending order by createAt
            primaryContact = primaryContacts[0]

            // others become secondry
            for (let pc of primaryContacts) {
                if (pc.id !== primaryContact.id) {
                    await Contact.update(
                        { linkPrecedence: 'secondary', linkedId: primaryContact.id },
                        { where: { id: pc.id } }
                    );
                }
            }

            contacts = await Contact.findAll({
                where: {
                    [Op.or]: [
                        { email },
                        { phoneNumber }
                    ]
                },
                order: [['createdAt', 'ASC']]
            });
        }

        if (contacts.length > 0) {
            primaryContact = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];

            for (let contact of contacts) {
                emails.add(contact.email);
                phoneNumbers.add(contact.phoneNumber);
                if (contact.id !== primaryContact.id) {
                    secondaryContactIds.push(contact.id);
                }
            }

            // new secondary contact if new email or phone is passed
            const existingEmail = contacts.some(c => c.email === email);
            const existingPhone = contacts.some(c => c.phoneNumber === phoneNumber);

            if (email && phoneNumber && (!existingEmail || !existingPhone)) {
                const newContact = await Contact.create({
                    email,
                    phoneNumber,
                    linkedId: primaryContact.id,
                    linkPrecedence: 'secondary'
                });

                secondaryContactIds.push(newContact.id);
                if (email) emails.add(email);
                if (phoneNumber) phoneNumbers.add(phoneNumber);
            }

        } else {
            // no match create a fresh primary contact
            primaryContact = await Contact.create({ email, phoneNumber });
            emails.add(email);
            phoneNumbers.add(phoneNumber);
        }

        return res.json({
            status: true,
            contact: {
                primaryContatctId: primaryContact.id,
                emails: Array.from(emails).filter(Boolean),
                phoneNumbers: Array.from(phoneNumbers).filter(Boolean),
                secondaryContactIds
            }
        });
    } catch (error) {
        console.log(error.stack);
        return res.status(500).json({ status: false, error: 'Something went wrong' });

    }
};

module.exports = identify;
