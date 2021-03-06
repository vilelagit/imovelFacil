const ImageRepository = require('../repositories/image-repository');
const ImovelRepository = require('../repositories/imovel-repository');

class ImovelController {
  async index(request, response) {
    const { orderBy } = request.query;
    const imoveis = await ImovelRepository.findAll(orderBy);
    return response.json(imoveis);
  }

  async show(request, response) {
    const { id } = request.params;
    const contact = await ImovelRepository.findById(id);
    if (!contact) {
      return response.status(404).json({ error: 'Imovel not found' });
    }
    response.json(contact);
  }

  async store(request, response) {
    const {
      area,
      descricao,
      endereco,
      valor,
      tipo,
      garagem,
      objetivo,
      quarto,
      banheiro,
      suite,
      piscina,
      condominio,
      portaria,
      image,
    } = request.body;

    const imovelExists = await ImovelRepository.findByAddress(endereco);
    if (imovelExists) {
      return response.status(400).json({ error: 'Este imóvel ja esta cadastrado.' });
    }
    if (tipo === 'quitinete') {
      const imovel = await ImovelRepository.create({
        tipo,
        objetivo,
        endereco,
        detalhes: {
          valor: Number(valor),
          area: Number(area),
          descricao,
          garagem: Number(garagem),
        },
      });
      if (imovel) {
        await ImageRepository.create({
          index: 0,
          url: image,
          id_imovel: imovel[0].id_imovel,
        });
      }
      response.json(imovel);
    } else if (tipo === 'apartamento') {
      const imovel = await ImovelRepository.create({
        tipo,
        objetivo,
        endereco,
        detalhes: {
          descricao,
          quarto,
          banheiro,
          garagem,
          suite,
          piscina,
          condominio,
          portaria,
          valor,
          area,
        },
      });
      if (imovel) {
        await ImageRepository.create({
          index: 0,
          url: image,
          id_imovel: imovel[0].id_imovel,
        });
      }
      response.json(imovel);
    } else {
      const imovel = await ImovelRepository.create({
        tipo,
        objetivo,
        endereco,
        detalhes: {
          descricao,
          quarto,
          banheiro,
          garagem,
          suite,
          piscina,
          valor,
          area,
        },
      });
      if (imovel) {
        await ImageRepository.create({
          index: 0,
          url: image,
          id_imovel: imovel[0].id_imovel,
        });
      }
      response.json(imovel);
    }
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      area,
      descricao,
      endereco,
      valor,
      garagem,
    } = request.body;
    const imovelExists = await ImovelRepository.findById(id);
    if (!imovelExists) {
      return response.status(404).json({ error: 'Imovel not found' });
    }

    const imovel = await ImovelRepository.update(id, {
      area,
      descricao,
      endereco,
      valor,
      garagem,
    });
    response.json(imovel);
  }

  async delete(request, response) {
    const { id } = request.params;
    const imovelExists = await ImovelRepository.findById(id);
    if (!imovelExists) {
      return response.status(404).json({ error: 'Imovel not found' });
    }
    await ImageRepository.delete(id);
    await ImovelRepository.delete(id);
    response.sendStatus(204);
  }
}

module.exports = new ImovelController();
