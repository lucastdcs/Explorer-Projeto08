import { GitHubUser } from "./GitHubUser.js"
export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.loads()

    }

    loads() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
        this.clearInput()
    }
    async add(username) {
        try {
            const user = await GitHubUser.search(username)
            if (user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }
            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } catch (error) {
            alert(error.message)
        }
    }
    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
        this.entries = filteredEntries
        this.update()
        this.save()
    }

}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onAdd()

    }
    onAdd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            this.add(value)
        }
    }
    update() {
        this.removeAllTr()
        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `
            https://github.com/${user.login}.png
            `
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a p').textContent = user.name
            row.querySelector('.user a span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar essa linha?')
                if (isOk) {
                    this.delete(user)
                }
            }
            this.tbody.append(row)
        })


    }

    createRow() {
        const tr = document.createElement('tr')
        const content = `
    <td class="user">
        <img src="https://github.com/lucastdcs.png" alt="Imagem de perfil">
        <a href="https://github.com/lucastdcs" target="_blank">
            <p>Lucas Teixeira</p>
            <span>lucastdcs</span>
        </a>
    </td>
    <td class="repositories">
        20
    </td>
    <td class="followers">
        1
    </td>
    <td>
        <button class="remove">
            &times;
        </button>
    </td>
    `
        tr.innerHTML = content

        return tr
    }
    removeAllTr() {

        this.tbody.querySelectorAll('tr').forEach((tr) => tr.remove())
    }
    clearInput() {
        this.root.querySelector('.search input').value = ''
    }
}