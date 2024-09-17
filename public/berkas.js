document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cctv-form');
    const entriesBody = document.getElementById('entries-body');
    const searchInput = document.getElementById('search');

    // Function to fetch entries from the server
    const fetchEntries = async () => {
        try {
            const response = await fetch('/entries');
            if (!response.ok) throw new Error('Network response was not ok');
            const entries = await response.json();
            displayEntries(entries);
        } catch (error) {
            entriesBody.innerHTML = `<h2>Error fetching data: ${error.message}</h2>`;
        }
    };

    // Function to display entries in the table
    const displayEntries = (entries) => {
        entriesBody.innerHTML = entries.map(entry => `
            <tr>
                <td>${entry.nomor}</td>
                <td>${entry.nama}</td>
                <td>${entry.password}</td>
                <td>${entry.nvr}</td>
            </tr>
        `).join('');
    };

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            nomor: formData.get('nomor'),
            nama: formData.get('nama'),
            password: formData.get('password'),
            nvr: formData.get('nvr')
        };

        // Check if all required fields are present
        if (!data.nomor || !data.nama || !data.password || !data.nvr) {
            entriesBody.innerHTML = '<h2>Please fill out all fields.</h2>';
            return;
        }

        try {
            const response = await fetch('/entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                fetchEntries(); // Refresh the data display after submission
                form.reset(); // Clear the form
            } else {
                const errorText = await response.text();
                entriesBody.innerHTML = `<h2>Error submitting data: ${errorText}</h2>`;
            }
        } catch (error) {
            entriesBody.innerHTML = `<h2>Error: ${error.message}</h2>`;
        }
    });


    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const rows = entriesBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const nomorCell = row.cells[0]?.textContent.toLowerCase() || '';
            const nvrCell = row.cells[3]?.textContent.toLowerCase() || '';

            if (nomorCell.includes(query) || nvrCell.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Initial fetch
    fetchEntries();
});
