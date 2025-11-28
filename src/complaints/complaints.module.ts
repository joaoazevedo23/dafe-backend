import { Module } from '@nestjs/common';
import { ComplaintsController } from './complaints.controller';
import { ComplaintsService } from './complaints.service';
import { Complaints, ComplaintsSchema } from './../models/complaints.schema';
import { MongooseModule } from '@nestjs/mongoose';

// Módulo mais avançado, pois é independende de outros post e do id do usuário, pois é anônimo.
//Possue dois módulos DTO. Um para criar e outro para atualizar as denúncias.

@Module({
  imports: [MongooseModule.forFeature([{ name: Complaints.name, schema: ComplaintsSchema}])],
  controllers: [ComplaintsController],
  providers: [ComplaintsService]
})
export class ComplaintsModule {}
