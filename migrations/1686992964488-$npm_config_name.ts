import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1686992964488 implements MigrationInterface {
    name = ' $npmConfigName1686992964488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`apiKey\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_da883f8d02581a40e6059bd7b38\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_da883f8d02581a40e6059bd7b38\` FOREIGN KEY (\`manufacturerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_da883f8d02581a40e6059bd7b38\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_da883f8d02581a40e6059bd7b38\` FOREIGN KEY (\`manufacturerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`apiKey\``);
    }

}
