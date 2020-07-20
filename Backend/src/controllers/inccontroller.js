const connection = require('../database/conectation');

module.exports = {


    async index(request, response) {
        const {page = 1} = request.query;

        const incidents = await connection('incidents')
            .limit(5)
            .offset((page - 1)* 5)
            .select('*');
        return response.json(incidents);
    },

    async create(request, response) {
        const { title, description, value } = request.body;
       const ong_id = request.headers.authorization;

    const [id] = await connection('incidents').insert({
          title,
          description,
          value,
          ong_id
      })
      return response.json({id})
    },

    async delete(request, response) {
        const {id} = request.params;
        const ong_id = request.headers.authorization;
        
        const incidents = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first()

        if(incidents.ong_id != ong_id) {
            return response.status(401).json({error: "operation not permitted"})
        }

        await connection('incidents').where('id', id).delete();
        return response.status(204).send();
    }
    

}