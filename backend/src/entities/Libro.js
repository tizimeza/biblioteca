"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Libro = void 0;
const typeorm_1 = require("typeorm");
const Autor_1 = require("./Autor");
const Estante_1 = require("./Estante");
const Genero_1 = require("./Genero");
const Saga_1 = require("./Saga");
let Libro = class Libro {
};
exports.Libro = Libro;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Libro.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Libro.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Libro.prototype, "anioPublicacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Libro.prototype, "nroEnSaga", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Autor_1.Autor, (autor) => autor.libros, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'autorId' }),
    __metadata("design:type", typeof (_a = typeof Autor_1.Autor !== "undefined" && Autor_1.Autor) === "function" ? _a : Object)
], Libro.prototype, "autor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Genero_1.Genero, (genero) => genero.libros, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'generoId' }),
    __metadata("design:type", typeof (_b = typeof Genero_1.Genero !== "undefined" && Genero_1.Genero) === "function" ? _b : Object)
], Libro.prototype, "genero", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Estante_1.Estante, (estante) => estante.libros, { nullable: false, onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'estanteId' }),
    __metadata("design:type", typeof (_c = typeof Estante_1.Estante !== "undefined" && Estante_1.Estante) === "function" ? _c : Object)
], Libro.prototype, "estante", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Saga_1.Saga, (saga) => saga.libros, {
        nullable: true,
        onDelete: 'RESTRICT',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'sagaId' }),
    __metadata("design:type", typeof (_d = typeof Saga_1.Saga !== "undefined" && Saga_1.Saga) === "function" ? _d : Object)
], Libro.prototype, "saga", void 0);
exports.Libro = Libro = __decorate([
    (0, typeorm_1.Entity)('libros')
], Libro);
