//berkas CCTV
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cctv-form');
    const entriesBody = document.getElementById('entries-body');
    let entries = [];

    // Function to fetch entries from the server
    const fetchEntries = async () => {
        const response = await fetch('/entries');
        entries = await response.json();
        displayEntries(entries);
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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nomor = document.getElementById('nomor').value;
        const nama = document.getElementById('nama').value;
        const password = document.getElementById('password').value;
        const nvr = document.getElementById('nvr').value;

        await fetch('/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nomor, nama, password, nvr })
        });

        // Clear the form
        form.reset();

        // Fetch and display the updated entries
        fetchEntries();
    });

    // Sorting function
    const sortEntries = (key) => {
        return entries.slice().sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
    };

    // Add event listeners to table headers for sorting
    document.getElementById('sort-nomor').addEventListener('click', () => {
        entries = sortEntries('nomor');
        displayEntries(entries);
    });

    document.getElementById('sort-nvr').addEventListener('click', () => {
        entries = sortEntries('nvr');
        displayEntries(entries);
    });

    // Initial fetch
    fetchEntries();
});