import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
    private posts = [
        {
            post_id: 1,
            post_usuario: "user2014",
            post_titulo: "Resumo da Aula de Matemática",
            post_conteudo: "Hoje revisamos equações do segundo grau.",
            post_descricao: "Conteúdo abordado na aula de matemática.",
            post_data: "2025-04-29",
            post_topico: "aulas",
            post_interacao: 12
        },
        {
            post_id: 2,
            post_usuario: "user2013",
            post_titulo: "Reunião com a Direção",
            post_conteudo: "Conversamos sobre melhorias na estrutura da escola.",
            post_descricao: "Resumo da reunião com os diretores.",
            post_data: "2025-04-28",
            post_topico: "diretores",
            post_interacao: 8
        },
        {
            post_id: 3,
            post_usuario: "user2012",
            post_titulo: "Comunicado aos Alunos",
            post_conteudo: "Lembramos a todos sobre o prazo da entrega do projeto.",
            post_descricao: "Aviso importante para os alunos.",
            post_data: "2025-04-27",
            post_topico: "alunos",
            post_interacao: 15
        },
        {
            post_id: 4,
            post_usuario: "user2011",
            post_titulo: "Atividade em Grupo",
            post_conteudo: "Realizamos uma dinâmica colaborativa na aula de história.",
            post_descricao: "Relato sobre a atividade prática realizada.",
            post_data: "2025-04-26",
            post_topico: "atividades",
            post_interacao: 20
        },
        {
            post_id: 5,
            post_usuario: "user2010",
            post_titulo: "Oficina de Teatro",
            post_conteudo: "Hoje tivemos a primeira aula da oficina de teatro.",
            post_descricao: "Atividade extracurricular iniciada neste semestre.",
            post_data: "2025-04-25",
            post_topico: "extracurriculares",
            post_interacao: 5
        }
    ]
    
    findAll(post_topico?: 'aulas' | 'diretores' | 'alunos' | 'atividades' | 'extracurriculares'){
        if(post_topico){
            return this.posts.filter(post => post.post_topico === post_topico)
        }
        return this.posts
    }

    findOne(id: number){
        const post = this.posts.find(post => post.post_id === id)
        return post
    }

    create(post: {
        post_titulo: string;
        post_usuario: string;
        post_conteudo: string;
        post_descricao: string;
        post_data: string; // formato: 'YYYY-MM-DD'
        post_topico: 'aulas' | 'diretores' | 'alunos' | 'atividades' | 'extracurriculares';
        post_interacao: number;
    }) {
        const MaiorId = [...this.posts].sort((a, b) => b.post_id - a.post_id);
        const NovoPost = {
            post_id: MaiorId[0]?.post_id + 1 || 1, // começa com 1 se o array estiver vazio
            ...post
        };
        this.posts.push(NovoPost);
        return NovoPost;
    }

    delete(id: number) {
        const post = this.findOne(id);
        if (!post) {
            return { message: `Postagem com id ${id} não encontrada.` };
        }
    
        this.posts = this.posts.filter(p => p.post_id !== id);
        return { message: `Postagem com id ${id} foi deletada com sucesso.` };
    }    
}