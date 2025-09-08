import { supabase } from '../../supabaseClient'

export async function createServiceCard(service) {
  try {
    console.log('Tentando salvar service no banco:ddd', service)
    
   
    const { data, error } = await supabase
      .from('service_cards')      // nome da tabela no Supabase
      .insert([service])     // insere o objeto no banco
      .select()              // retorna o registro inserido

    if (error) {
      console.error('Erro ao criar serviço no Supabase:', error)
      console.error('Detalhes do erro:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return null
    }

    return data[0]        // retorna o registro criado
  } catch (error) {
    console.error('Erro na função createServiceCard:', error)
    return null
  }
}


export async function deleteServiceCard(id) {
    try {
      console.log('Tentando deletar service com id:', id);
  
      const { data, error } = await supabase
        .from('service_cards')   // nome da tabela no Supabase
        .delete()                // comando de delete
        .eq('id', id)            // condição: id do registro
        .select();               // retorna o registro deletado
  
      if (error) {
        console.error('Erro ao deletar serviço no Supabase:', error);
        console.error('Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }
  
      console.log('Service deletado com sucesso no Supabase:', data[0]);
      return data[0];  // retorna o registro deletado
    } catch (error) {
      console.error('Erro na função deleteServiceCard:', error);
      return null;
    }
  }
  

  export async function selectAllServiceCards() {
    try {
      const { data, error } = await supabase
        .from('service_cards')
        .select('*')
        .order('id', { ascending: true }); // você pode trocar por created_at, se tiver esse campo
  
      if (error) {
        console.error('Erro ao buscar todos os serviços no Supabase:', error);
        console.error('Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }
  
      console.log('Todos os registros da tabela service_cards:', data);
      return data; // retorna todos os registros
    } catch (error) {
      console.error('Erro na função selectAllServiceCards:', error);
      return null;
    }
  }


  export async function updateServiceCard(id, updates) {
    try {
      console.log('Tentando atualizar service com id:', id, 'com os dados:', updates);
  
      const { data, error } = await supabase
        .from('service_cards')
        .update(updates)   // objeto com os campos que você quer atualizar
        .eq('id', id)      // condição: registro que deve ser atualizado
        .select();         // retorna o registro atualizado
  
      if (error) {
        console.error('Erro ao atualizar serviço no Supabase:', error);
        console.error('Detalhes do erro:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }
  
      if (!data || data.length === 0) {
        console.warn('Nenhum registro encontrado para atualizar com id:', id);
        return null;
      }
  
      console.log('Service atualizado com sucesso:', data[0]);
      return data[0]; // retorna o registro atualizado
    } catch (error) {
      console.error('Erro na função updateServiceCard:', error);
      return null;
    }
  }
  
  