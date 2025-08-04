document.addEventListener('DOMContentLoaded', () => {
    const dateElement = document.getElementById('current-date');
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = `Date: ${today.toLocaleDateString('en-US', options)}`;

    let allPosts = [];
    let filteredPosts = [];
    let currentPage = 1;
    let postsPerPage = parseInt(document.getElementById('posts-per-page').value);

    const postsContainer = document.getElementById('posts-container');
    const searchInput = document.getElementById('search-input');
    const postsPerPageSelect = document.getElementById('posts-per-page');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfoSpan = document.getElementById('page-info');

    async function fetchPosts() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            console.log('Result from first fetch:', data);

            allPosts = data;
            filterAndRenderPosts();
        } catch (error) {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = '<p style="color: red;">Failed to load posts. Please try again later.</p>';
        }
    }

    function filterAndRenderPosts() {
        const searchTerm = searchInput.value.toLowerCase();

        filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm)
        );

        currentPage = 1;
        renderPosts();
    }

    function renderPosts() {
        postsContainer.innerHTML = '';

        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToRender = filteredPosts.slice(startIndex, endIndex);

        if (postsToRender.length === 0) {
            postsContainer.innerHTML = '<p>No posts found matching your criteria.</p>';
            updatePaginationControls();
            return;
        }

        postsToRender.forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <small>User ID: ${post.userId}</small>
            `;
            postsContainer.appendChild(postCard);
        });

        updatePaginationControls();
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        pageInfoSpan.textContent = `Page ${currentPage} of ${totalPages}`;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || filteredPosts.length === 0;
    }

    function goToNextPage() {
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPosts();
        }
    }

    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderPosts();
        }
    }

    searchInput.addEventListener('input', filterAndRenderPosts);
    postsPerPageSelect.addEventListener('change', (event) => {
        postsPerPage = parseInt(event.target.value);
        filterAndRenderPosts();
    });
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);

    fetchPosts();
});