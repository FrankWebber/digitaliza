[33mcommit be6b4dd0904e321488ccc771f0b8da10b4ee0c98[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmaster[m[33m, [m[1;31morigin/master[m[33m)[m
Author: Administrador local do computador <admlocal@GPREV03.seduc.am.gov.br>
Date:   Fri Oct 11 11:38:59 2024 -0400

    Envio para https://github.com/FrankWebber/sisdigita-liza/tree/master

[33mcommit 2980210fb2e6a7271ae5f96b87a21613189320f7[m
Author: Administrador local do computador <admlocal@GPREV03.seduc.am.gov.br>
Date:   Thu Oct 10 17:16:05 2024 -0400

    Atualizações no backend e frontend, incluindo ajustes no processamento OCR e upload de PDFs

[33mcommit 3254f0a31eb06839567a7d91875163452a0a6042[m
Author: FrankWebber <47332986+FrankWebber@users.noreply.github.com>
Date:   Wed Oct 9 22:14:58 2024 -0400

    Update UploadForm.js
    
    Aqui está o arquivo UploadForm.js corrigido para remover as variáveis não utilizadas e simplificar o código. Como você mencionou, vamos remover setUploading e jobId, já que não estamos usando essas variáveis. O status também pode ser removido, pois ele não está sendo utilizado diretamente. Aqui está o código atualizado:

[33mcommit 8b79907a529c9c2627047b7decbf011e8806063c[m
Author: FrankWebber <47332986+FrankWebber@users.noreply.github.com>
Date:   Wed Oct 9 22:12:22 2024 -0400

    Update OCRButton.js
    
    Aqui removemos o jobId de estado, pois ele não é necessário para o funcionamento do componente, mas mantivemos o status, já que ele é usado para exibir o progresso do OCR.

[33mcommit 47c820f382540bfbe140b61a4c8ff3a23a5efa58[m
Author: FrankWebber <47332986+FrankWebber@users.noreply.github.com>
Date:   Wed Oct 9 22:08:50 2024 -0400

    Update ConsoleOutput.js
    
    remover a variável setUploading que não está sendo utilizada. Veja a versão corrigida:

[33mcommit d9675aebd1320331d8f26822ac297902d894fbbe[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Wed Oct 9 19:54:17 2024 -0400

    para primeiro deploy

[33mcommit 4103f1db431d219127c42d58383a2f9cf0e38782[m
Author: FrankWebber <47332986+FrankWebber@users.noreply.github.com>
Date:   Wed Oct 9 15:50:02 2024 -0400

    Update requirements.txt
    
    REMOVI GUNICORN

[33mcommit 1a7fef6d7e68b21f4f288b2cf021e6b70d1c7ef4[m
Author: FrankWebber <47332986+FrankWebber@users.noreply.github.com>
Date:   Wed Oct 9 15:12:12 2024 -0400

    Update requirements.txt

[33mcommit a61608e29e617e969f208e980ce9aaeebb727e62[m
Author: FrankWebber <47332986+FrankWebber@users.noreply.github.com>
Date:   Wed Oct 9 15:11:27 2024 -0400

    Update requirements.txt
    
    Flask==2.3.2
    Werkzeug==2.3.4
    requests==2.28.2
    boto3==1.26.7
    flask_cors==3.0.10
    python-dotenv==1.0.0
    gunicorn

[33mcommit 1a8412fe985049c1ce6ee5939079850e5d556237[m
Author: FrankWebber <47332986+FrankWebber@users.noreply.github.com>
Date:   Wed Oct 9 12:59:48 2024 -0400

    Create heroku.yml

[33mcommit 427c5a181a4a7bb9be74260edbf579451199b7c6[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Tue Oct 8 21:28:25 2024 -0400

    Atualiza .gitignore para ignorar arquivos da pasta results

[33mcommit 00ce01d0ce9403fd083001fe123b9de6b04b6ffc[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Tue Oct 8 19:40:39 2024 -0400

    Atualiza .gitignore para ignorar arquivos desnecessários

[33mcommit f08a2f746985c7385aa709dc41b35382ce0d7298[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Tue Oct 8 19:34:29 2024 -0400

    Remove AWS keys from history

[33mcommit c5521a361dbb343a7852b27fe4df7b4859d6af39[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Tue Oct 8 02:47:13 2024 -0400

    Atualizando .gitignore e removendo node_modules do rastreamento

[33mcommit 41c4354220504d5063942414419e2ea461999534[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Tue Oct 8 02:36:06 2024 -0400

    Adicionando arquivo grande ao Git LFS

[33mcommit 8f43dc84ae67eacbafb5062f2104fc3582e7718a[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Tue Oct 8 02:25:29 2024 -0400

    Atualizando .gitignore para remover entradas duplicadas

[33mcommit e127535b9d7300bb880707031f571c216faddbfe[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Tue Oct 8 02:21:45 2024 -0400

    Removendo a pasta 'stuff' do controle de versão e atualizando .gitignore

[33mcommit d7fb65b9187323f94f6b225b45be0192a7bf6c72[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Tue Oct 8 02:14:08 2024 -0400

    Descrição das alterações que você fez

[33mcommit 9dfe895c211c2ba30ded20c821c2bf118e301a33[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Mon Oct 7 00:29:21 2024 -0400

    Adiciona todas as alterações e atualizações do projeto digita-liza

[33mcommit ab51e8498a262c175eee264bcfeeefa898b9f454[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Mon Oct 7 00:27:06 2024 -0400

    Adiciona todas as alterações e atualizações do projeto

[33mcommit 1eaf43a1f719d579f17c1abac0f5c176e67f20db[m
Author: Frank Webber <frankwebber33@hotmail.com>
Date:   Fri Oct 4 01:32:56 2024 -0400

    Descrição das alterações que você fez

[33mcommit d4c78304843b6e9ec74114221a803b632fcd561b[m
Author: FrankWebber <47332986+FrankWebber@users.noreply.github.com>
Date:   Thu Oct 3 16:54:03 2024 -0400

    Adicionando arquivos do projeto digitalizalaudos
