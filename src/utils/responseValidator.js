export const isInvalidResponse = (resposta) => {
  if (!resposta) {
    return true;
  }

  if (typeof resposta !== 'string') {
    return false;
  }

  return resposta.includes('"error"') && resposta.includes('429');
};
