let allInternships = [];

async function loadInternships() {
    try {
        const response = await fetch('internship.JSON');
        allInternships = await response.json();
        displayInternships(allInternships);
    } catch (error) {
        console.error('Error loading internships:', error);
    }
}

function displayInternships(data) {
    const tableBody = document.getElementById("table-data");
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        const company = item.job_type[0] || "-";
        const skills = item.job_type.slice(1, 5).join(", ");
        const durationStr = item.job_type.find(v => v.toLowerCase().includes("duration")) || "-";
        const duration = durationStr.includes(":") ? durationStr.split(":")[1].trim() : durationStr;
        const stipendStr = item.job_type.find(v => v.toLowerCase().includes("stipend")) || "-";
        const stipend = stipendStr.includes(":") ? stipendStr.split(":")[1].trim() : stipendStr;
        const typeStr = item.job_type.find(v => v.toLowerCase().includes("work")) || "-";
        let type = typeStr.includes(":") ? typeStr.split(":")[1].trim() : typeStr;
        if (index >= data.length - 3) {
            type = company;
        }
        const timeStr = item.job_type.find(v => v.toLowerCase().includes("time")) || "-";
        const time = timeStr.includes(":") ? timeStr.split(":")[1].trim() : timeStr;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${company}</td>
            <td>${skills}</td>
            <td>${item.salary.currency}${item.salary.min} - ${item.salary.currency}${item.salary.max}</td>
            <td>${duration}</td>
            <td>${stipend}</td>
            <td>${type}</td>
            <td>${time}</td>
            <td>
                <a href="${item.referal_link}" target="_blank">Apply</a>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function searchInternships() {
    const searchTerm = document.getElementById('Internship').value.toLowerCase().trim();

    if (searchTerm === '') {
        displayInternships(allInternships);
        return;
    }

    const filteredInternships = allInternships.filter(internship => {
    
        const searchableText = [
            internship.id,
            internship.title,
            internship.job_type.join(' '),
            internship.salary.currency + internship.salary.min,
            internship.salary.currency + internship.salary.max,
            internship.referal_link
        ].join(' ').toLowerCase();

        return searchableText.includes(searchTerm);
    });

    displayInternships(filteredInternships);
}

document.getElementById('searchBtn').addEventListener('click', searchInternships);
document.getElementById('Internship').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchInternships();
    }
});

loadInternships();
