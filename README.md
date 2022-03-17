# Projetos_iJunior

## Arquivos Postmans

Todos os projetos possuem em seus respectivos diretórios arquivos "postman.json". Este arquivo pode ser importado dentro de uma workspace do postman, 
ele já contém todas as rotas com as chamdas implementadas para serem usadas no teste dos projetos.

Para importar os arquivos no Postman basta seguir o passo a passo do link a baixo:
https://kb.datamotion.com/?ht_kb=postman-instructions-for-exporting-and-importing

## Atenção - Projeto 3 Headers

Para acessar as rotas presentes no projeto 3 (menos a 'inserirUsuario' e a 'usuario/login') é preciso alterar x-access-token presente no header do postman.  
Este token é um JWT que é gerado ao realizar o login e que é retornado no body. Logo, você tem que copiar este token que é retornado ao 
relizar um login nos headers de todas a rotas que for relizar alguma operação, menos as duas citadas anteriormente.
