import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        cancelled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancellable: {
          type: Sequelize.VIRTUAL,
          get() {
            return (
              isBefore(new Date(), subHours(this.date, 2)) &&
              this.created_at == null
            );
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    // Se um model possui mais de um relacionamento com uma mesma tabela, é obrigatoria a criação de um apelido para o relacionamento ('as: ')
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
