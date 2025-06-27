exports.handler = async (event, context) => {
  // URL do seu webhook do Make
  const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/k2vb52pvrs3gi5p7fg8z9ew0m029zpbd';
  
  // ID do canal que você quer receber
  const CANAL_PERMITIDO = 'wp351072341433407';
  
  console.log('🔥 Webhook recebido:', new Date().toISOString());
  
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Método não permitido. Use POST.' })
      };
    }
    
    // Parse dos dados recebidos do Suri
    const data = JSON.parse(event.body);
    
    // 🔍 DEBUG - Vamos ver TODA a estrutura dos dados
    console.log('📋 ESTRUTURA COMPLETA DOS DADOS:');
    console.log(JSON.stringify(data, null, 2));
    
    // 🔍 DEBUG - Verificar especificamente o campo channel
    console.log('📋 DADOS DO CANAL:');
    console.log('data.channel:', data.channel);
    console.log('data.channel?.Id:', data.channel?.Id);
    console.log('data.channel?.id:', data.channel?.id);
    console.log('data.channel?.ID:', data.channel?.ID);
    
    // 🔍 DEBUG - Verificar outros possíveis campos
    console.log('📋 OUTROS CAMPOS POSSÍVEIS:');
    console.log('data.channelId:', data.channelId);
    console.log('data.channel_id:', data.channel_id);
    console.log('data.chatId:', data.chatId);
    console.log('data.chat?.id:', data.chat?.id);
    
    // 🔍 DEBUG - Listar todas as chaves do objeto principal
    console.log('📋 TODAS AS CHAVES DO OBJETO:');
    console.log('Chaves:', Object.keys(data));
    
    // ⚠️ TEMPORÁRIO - Enviar TODAS as mensagens para o Make para teste
    console.log('🚀 ENVIANDO PARA O MAKE (MODO DEBUG - TODOS OS CANAIS)');
    
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
          message: 'MODO DEBUG - Enviado para Make (todos os canais)',
          debug: 'Verifique os logs para ver a estrutura dos dados'
        })
      };
    } else {
      console.error('❌ Erro ao enviar para o Make:', response.status);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erro ao enviar para o Make' })
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
