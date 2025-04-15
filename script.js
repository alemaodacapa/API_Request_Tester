document.addEventListener('DOMContentLoaded', () => {
    const methodSelect = document.getElementById('methodSelect');
    const bodySection = document.getElementById('bodySection');

    methodSelect.addEventListener('change', () => {
        bodySection.style.display = ['POST', 'PUT', 'PATCH'].includes(methodSelect.value) 
            ? 'block' 
            : 'none';
    });

    document.getElementById('requestForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const method = document.getElementById('methodSelect').value;
        const url = document.getElementById('urlInput').value;
        const headers = getHeaders();
        const body = method !== 'GET' 
            ? document.getElementById('bodyTextarea').value 
            : null;

        try {
            const startTime = performance.now();
            const response = await fetchWithTimeout(url, {
                method,
                headers: headers,
                body: body && method !== 'GET' ? body : undefined
            });

            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);

            document.getElementById('statusCode').textContent = response.status;
            document.getElementById('requestTime').textContent = duration;

            const responseBody = await response.text();
            try {
                const formattedJson = JSON.stringify(JSON.parse(responseBody), null, 2);
                document.getElementById('responseText').textContent = formattedJson;
            } catch {
                document.getElementById('responseText').textContent = responseBody;
            }
        } catch (error) {
            document.getElementById('responseText').textContent = error.message;
            document.getElementById('statusCode').textContent = 'Error';
        }
    });

    // Example button functionality
    const exampleButton = document.getElementById('exampleButton');
    const exampleSection = document.getElementById('exampleSection');

    exampleButton.addEventListener('click', () => {
        const exampleContent = `Claro! Aqui vai uma nova simulação usando uma **API de teste pública gratuita**, ideal para praticar com o **Postman**:

### 🔗 API de Teste: [https://reqres.in](https://reqres.in)

#### 1. **GET** — Listar usuários

- **Method:** \`GET\`  
- **URL:** \`https://reqres.in/api/users?page=1\`  
- **Headers:**  
  \`\`\`json
  Accept: application/json
  \`\`\`
- **Resposta esperada (exemplo):**
  \`\`\`json
  {
    "page": 1,
    "per_page": 6,
    "total": 12,
    "data": [ ... ]
  }
  \`\`\`

---

#### 2. **POST** — Criar usuário

- **Method:** \`POST\`  
- **URL:** \`https://reqres.in/api/users\`  
- **Headers:**  
  \`\`\`json
  Content-Type: application/json
  Accept: application/json
  \`\`\`
- **Body (raw > JSON):**
  \`\`\`json
  {
    "name": "João",
    "job": "Desenvolvedor"
  }
  \`\`\`
- **Resposta esperada:**
  \`\`\`json
  {
    "name": "João",
    "job": "Desenvolvedor",
    "id": "123",
    "createdAt": "2025-04-15T12:34:56.789Z"
  }
  \`\`\`

---

#### 3. **PUT** — Atualizar usuário (completo)

- **Method:** \`PUT\`  
- **URL:** \`https://reqres.in/api/users/2\`  
- **Headers:**  
  \`\`\`json
  Content-Type: application/json
  Accept: application/json
  \`\`\`
- **Body:**
  \`\`\`json
  {
    "name": "João Atualizado",
    "job": "Engenheiro"
  }
  \`\`\`
- **Resposta esperada:**
  \`\`\`json
  {
    "name": "João Atualizado",
    "job": "Engenheiro",
    "updatedAt": "2025-04-15T12:34:56.789Z"
  }
  \`\`\`

---

#### 4. **PATCH** — Atualização parcial

- **Method:** \`PATCH\`  
- **URL:** \`https://reqres.in/api/users/2\`  
- **Headers:**  
  \`\`\`json
  Content-Type: application/json
  Accept: application/json
  \`\`\`
- **Body:**
  \`\`\`json
  {
    "job": "Analista"
  }
  \`\`\`
- **Resposta esperada:**
  \`\`\`json
  {
    "job": "Analista",
    "updatedAt": "2025-04-15T12:34:56.789Z"
  }
  \`\`\``;

        // Toggle example section visibility
        if (exampleSection.style.display === 'none' || exampleSection.style.display === '') {
            exampleSection.style.display = 'block';
            exampleSection.textContent = exampleContent;
        } else {
            exampleSection.style.display = 'none';
        }
    });
});

function addHeaderRow() {
    const container = document.getElementById('headersContainer');
    const newRow = document.createElement('div');
    newRow.className = 'input-group mb-2';
    newRow.innerHTML = `
        <input type="text" class="form-control header-key" placeholder="Key">
        <input type="text" class="form-control header-value" placeholder="Value">
        <button type="button" class="btn btn-danger" onclick="this.closest('.input-group').remove()">-</button>
    `;
    container.appendChild(newRow);
}

function getHeaders() {
    const headers = {};
    const headerRows = document.querySelectorAll('#headersContainer .input-group');
    
    headerRows.forEach(row => {
        const key = row.querySelector('.header-key').value.trim();
        const value = row.querySelector('.header-value').value.trim();
        
        if (key && value) {
            headers[key] = value;
        }
    });

    // Adiciona header padrão para JSON se não existir
    if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
}

async function fetchWithTimeout(url, options, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}
