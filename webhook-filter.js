exports.handler = async (event, context) => {
  // URL do seu webhook do Make
  const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/k2vb52pvrs3gi5p7fg8z9ew0m029zpbd';
  
  // ID do canal que você quer receber
  const CANAL_PERMITIDO = 'wp351072341433407';
  
  // Log para debug
  console.log('Webhook recebido:', new Date().toISOString());
  
  try {
    // Verificar se é uma requisição POST
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método não permitido. Use POST.' })
      };
    }
    
    // Parse dos dados recebidos do Suri
    const data = JSON.parse(event.body);
    
    // Log dos dados recebidos (para debug)
    console.log('Dados recebidos:', {
      canal: data.channel?.Name || 'Não informado',
      canalId: data.channel?.Id || 'Não informado',
      tipo: data.type || 'Não informado'
    });
    
    // Verificar se é do canal específico
    if (data.channel && data.channel.Id === CANAL_PERMITIDO) {
      
      console.log('✅ Canal permitido! Enviando para o Make...');
      
      // Reenviar para o Make
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        console.log('✅ Enviado com sucesso para o Make');
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            success: true,
            message: 'Webhook processado e enviado para Make',
            canal: data.channel.Name
          })
        };
      } else {
        console.error('❌ Erro ao enviar para o Make:', response.status);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Erro ao enviar para o Make' })
        };
      }
      
    } else {
      // Mensagem de outro canal - ignorar
      console.log('❌ Canal não permitido. Ignorando mensagem.');
      console.log('Canal recebido:', data.channel?.Id);
      console.log('Canal permitido:', CANAL_PERMITIDO);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          success: true,
          message: 'Mensagem ignorada - canal não é o permitido',
          canalRecebido: data.channel?.Name || 'Desconhecido',
          canalPermitido: CANAL_PERMITIDO
        })
      };
    }
    
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Erro interno do servidor',
        details: error.message
      })
    };
  }
};
