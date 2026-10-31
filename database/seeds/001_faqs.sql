INSERT INTO faqs(category,question,answer) VALUES
('Admissions','How can I apply for admission?','Visit the college admission portal, review the current admission notice, complete the application form, and submit the required documents before the official deadline.'),
('Admissions','Which documents are generally required?','Commonly requested documents include academic marksheets, leaving or transfer certificate, identity proof, photographs, and applicable category or domicile documents. Confirm the exact list in the current college admission notice.'),
('Eligibility','How do I check course eligibility?','Eligibility depends on the course and current admission rules. Check the official course prospectus or contact the admission office for the latest criteria.'),
('Fees','Where can I find the fee structure?','Refer to the official college fee notice or admission office. Fees may vary by course, category, and academic year.'),
('Support','How can I contact the admission office?','Use the contact information published on the college official website. AskCampus does not invent or assume college contact details.')
ON CONFLICT DO NOTHING;
