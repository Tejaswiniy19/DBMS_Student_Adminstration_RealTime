import jsPDF from "jspdf";

export const generateAdmissionLetter = (student) => {
const doc = new jsPDF();

doc.setFontSize(22);
doc.text("Admission Confirmation Letter", 20, 20);

doc.setFontSize(12);

doc.text(`Student Name: ${student.fullName}`, 20, 50);
doc.text(`Email: ${student.email}`, 20, 60);
doc.text(`Course: ${student.course}`, 20, 70);
doc.text(`Branch: ${student.branch}`, 20, 80);

doc.text(
"Congratulations! Your admission has been approved.",
20,
100
);

doc.text(
"Welcome to our University Admission Management System.",
20,
120
);

doc.save("Admission_Letter.pdf");
};
