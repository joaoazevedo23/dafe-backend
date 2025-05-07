import { Injectable } from '@nestjs/common';


// A principio dados mockados.
@Injectable()
export class CommentsService {
    private comments = [
        {
            comment_id: 1,
            comment_conteudo: "Hoje revisamos equações do segundo grau.",
            comment_data: "2025-04-29",
            id_aluno: 1,
            id: 1
        },
        {
            comment_id: 2,
            comment_conteudo: "Gostei muito da explicação sobre funções quadráticas!",
            comment_data: "2025-04-29",
            id_aluno: 2,
            id: 1
        },
        {
            comment_id: 3,
            comment_conteudo: "Achei a aula de hoje bem clara, principalmente os exemplos.",
            comment_data: "2025-04-29",
            id_aluno: 3,
            id: 1
        },
        {
            comment_id: 4,
            comment_conteudo: "Ainda tenho dúvidas sobre como resolver a fórmula de Bhaskara.",
            comment_data: "2025-04-29",
            id_aluno: 4,
            id: 1
        },
        {
            comment_id: 5,
            comment_conteudo: "A atividade prática ajudou bastante a entender o conteúdo.",
            comment_data: "2025-04-29",
            id_aluno: 5,
            id: 1
        }
    ]


     
}
