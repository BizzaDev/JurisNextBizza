// seu cliente do Supabase
import { supabase } from "../../supabaseClient"
import { base64ToBlob } from "../../utils/photo-convert"

// Converte entrada (Blob/File ou dataURL) para Blob e retorna também o contentType
function normalizePhotoInput(photoInput) {
  if (!photoInput) return { blob: null, contentType: null }

  // Caso já seja Blob/File
  if (photoInput instanceof Blob) {
    return { blob: photoInput, contentType: photoInput.type || "image/jpeg" }
  }

  // Caso seja dataURL (base64)
  if (typeof photoInput === "string" && photoInput.startsWith("data:")) {
    const mime = photoInput.split(",")[0].split(":")[1].split(";")[0]
    const blob = base64ToBlob(photoInput)
    return { blob, contentType: mime || "image/jpeg" }
  }

  // Fallback: não suportado
  return { blob: null, contentType: null }
}

export async function uploadPhoto(memberId, photoInput) {
  const { blob, contentType } = normalizePhotoInput(photoInput)
  if (!blob) return null // se não houver foto válida

  const filePath = `photos/${memberId}.jpg` // caminho da foto no Storage (extensão meramente ilustrativa)

  // Faz upload com upsert para permitir sobrescrever quando necessário
  const { error } = await supabase
    .storage
    .from('users-members')
    .upload(filePath, blob, { upsert: true, contentType: contentType || 'image/jpeg' })

  if (error) {
    console.error('Erro ao enviar a foto:', error)
    return null
  }

  // retorna a URL pública da foto
  const { data: { publicUrl } } = supabase
    .storage
    .from('users-members')
    .getPublicUrl(filePath)

  console.log('Foto salva com sucesso:', publicUrl)
  return publicUrl
}

export async function updatePhoto(memberId, photoInput) {
  const { blob, contentType } = normalizePhotoInput(photoInput)
  if (!blob) return null

  // Usa nome único para garantir substituição visual e evitar conflitos de Storage/CDN
  const timestamp = Date.now()
  const fileName = `${memberId}-${timestamp}.jpg`
  const filePath = `photos/${fileName}`

  // Faz upload da nova foto
  const { error } = await supabase
    .storage
    .from('users-members')
    .upload(filePath, blob, { contentType: contentType || 'image/jpeg' })

  if (error) {
    console.error('Erro ao enviar a foto:', error)
    return null
  }

  // Obtém URL pública do novo arquivo
  const { data: { publicUrl } } = supabase
    .storage
    .from('users-members')
    .getPublicUrl(filePath)

  // Limpa arquivos antigos deste usuário de forma melhor-esforço (não bloqueante)
  try {
    const { data: listed } = await supabase
      .storage
      .from('users-members')
      .list('photos')
    if (Array.isArray(listed)) {
      const oldFiles = listed
        .filter(f => f.name.startsWith(`${memberId}-`) && f.name !== fileName)
        .map(f => `photos/${f.name}`)
      if (oldFiles.length > 0) {
        await supabase.storage.from('users-members').remove(oldFiles)
      }
    }
  } catch (cleanupError) {
    console.warn('Falha ao limpar fotos antigas (ignorado):', cleanupError)
  }

  console.log('Foto atualizada com sucesso:', publicUrl)
  return { publicUrl, relativePath: filePath }
}


export async function saveMemberToDatabase(member) {
  // Upload da foto (aceita Blob/File ou base64)
  const photoUrl = await uploadPhoto(member.id, member.photo)

  // Salvar dados na tabela
  const { data, error } = await supabase
    .from('users-members-datas')
    .insert([
      {
        id: member.id,
        name: member.name,
        role: member.role,
        specialty: member.specialty,
        experience: parseInt(member.experience),
        photo_url: photoUrl
      }
    ])

  if (error) {
    console.error('Erro ao salvar usuário:', error)
  } else {
    console.log('Membro salvo com sucesso:', data)
  }
}



export async function getMembers() {
  const { data, error } = await supabase
    .from('users-members-datas')
    .select('*') // seleciona todas as colunas

  if (error) {
    console.error('Erro ao buscar membros:', error)
    return []
  }

  const dataMembers = data.map(member => ({
    id: member.id,
    name: member.name,
    role: member.role,
    specialty: member.specialty,
    experience: member.experience,
    photo_url: member.photo_url
  }))

  console.log('dataMembers', dataMembers)
  return dataMembers
}


export async function deleteMember(memberId) {
  // Primeiro, tenta deletar registro do banco
  const { data, error } = await supabase
    .from('users-members-datas')
    .delete()
    .eq('id', memberId)

  if (error) {
    console.error(`Erro ao deletar membro ${memberId}:`, error)
    return null
  }

  // Depois, remove todas as fotos relacionadas a este membro (melhor-esforço)
  try {
    await deleteMemberPhotos(memberId)
  } catch (e) {
    console.warn(`Falha ao remover fotos do membro ${memberId} (ignorado):`, e)
  }

  console.log(`Membro ${memberId} deletado com sucesso!`)
  return data
}

// Remove todas as fotos do Storage referentes a um membro
export async function deleteMemberPhotos(memberId) {
  // lista todos os arquivos na pasta 'photos'
  const { data: listed, error: listError } = await supabase
    .storage
    .from('users-members')
    .list('photos')

  if (listError) {
    console.error('Erro ao listar fotos para remoção:', listError)
    return false
  }

  if (!Array.isArray(listed) || listed.length === 0) {
    return true
  }

  // Padrões possíveis: memberId.jpg (upload inicial) e memberId-<timestamp>.jpg (edições)
  const targets = listed
    .filter(f => f.name === `${memberId}.jpg` || f.name.startsWith(`${memberId}-`))
    .map(f => `photos/${f.name}`)

  if (targets.length === 0) return true

  const { error: removeError } = await supabase
    .storage
    .from('users-members')
    .remove(targets)

  if (removeError) {
    console.error('Erro ao remover fotos do membro:', removeError)
    return false
  }

  console.log(`Fotos removidas para o membro ${memberId}:`, targets.length)
  return true
}


// Atualizar um membro
export async function updateMember(memberId, updatedData) {
  let photoUrl = null

  // Se houver uma nova foto (Blob/File ou base64), faz o upload e pega a URL
  if (updatedData.photo) {
    const uploaded = await updatePhoto(memberId, updatedData.photo)
    photoUrl = uploaded?.publicUrl || null

    // Limpar fotos antigas baseado no caminho relativo salvo
    try {
      const memberPrefix = `photos/${memberId}-`
      const { data: listed } = await supabase
        .storage
        .from('users-members')
        .list('photos')
      if (Array.isArray(listed)) {
        const oldFiles = listed
          .filter(f => f.name.startsWith(`${memberId}-`) && (`photos/${f.name}`) !== uploaded?.relativePath)
          .map(f => `photos/${f.name}`)
        if (oldFiles.length > 0) {
          await supabase.storage.from('users-members').remove(oldFiles)
        }
      }
    } catch (cleanupError) {
      console.warn('Falha ao limpar arquivos antigos após updateMember (ignorado):', cleanupError)
    }
  }

  // Prepara os dados para atualizar
  const dataToUpdate = {
    name: updatedData.name,
    role: updatedData.role,
    specialty: updatedData.specialty,
    experience: updatedData.experience ? parseInt(updatedData.experience) : undefined,
    // Só atualiza a URL da foto se houver nova URL válida
    photo_url: photoUrl ?? undefined
  }

  // Remove campos undefined para não sobrescrever com nulo
  Object.keys(dataToUpdate).forEach(
    key => dataToUpdate[key] === undefined && delete dataToUpdate[key]
  )

  // Atualiza o membro no banco
  const { data, error } = await supabase
    .from('users-members-datas')
    .update(dataToUpdate)
    .eq('id', memberId)

  if (error) {
    console.error(`Erro ao atualizar membro ${memberId}:`, error)
    return null
  }

  console.log(`Membro ${memberId} atualizado com sucesso!`)
  return data
}
